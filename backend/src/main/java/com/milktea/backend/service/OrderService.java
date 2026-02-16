package com.milktea.backend.service;

import com.milktea.backend.dto.OrderDetailResponse;
import com.milktea.backend.model.Order;
import com.milktea.backend.repository.OrderItemRepository;
import com.milktea.backend.repository.OrderRepository;
import com.milktea.backend.repository.OrderItemRepository.OrderItemView;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final JdbcTemplate jdbcTemplate;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        JdbcTemplate jdbcTemplate) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    public int createOrder(String createdBy) {
        String who = (createdBy == null || createdBy.isBlank()) ? "UNKNOWN" : createdBy.trim();
        return orderRepository.create(who);
    }

    public void addOrderItem(int orderId, int productId, int quantity) {
        if (quantity <= 0) throw new IllegalArgumentException("quantity must be > 0");

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found"));

        if (!"CREATED".equals(order.getStatus())) {
            throw new IllegalStateException("Order not editable unless status=CREATED");
        }

        Integer priceCents = jdbcTemplate.query(
                "SELECT price_cents FROM product WHERE product_id = ? AND is_active = 1",
                rs -> rs.next() ? rs.getInt("price_cents") : null,
                productId
        );
        if (priceCents == null) throw new NoSuchElementException("Product not found or inactive");

        orderItemRepository.upsertAddQuantity(orderId, productId, quantity, priceCents);
    }

    @Transactional
    public void completeOrder(int orderId) {
        Order order = orderRepository.findByIdForUpdate(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found"));

        if ("COMPLETED".equals(order.getStatus())) {
            throw new IllegalStateException("Order already completed");
        }
        if ("CANCELED".equals(order.getStatus())) {
            throw new IllegalStateException("Canceled order cannot be completed");
        }
        if (!"CREATED".equals(order.getStatus())) {
            throw new IllegalStateException("Only CREATED order can be completed");
        }

        String usageSql = """
                SELECT r.ingredient_id,
                       SUM(oi.quantity * r.qty_required) AS total_used
                FROM order_item oi
                JOIN recipe r ON r.product_id = oi.product_id
                WHERE oi.order_id = ?
                GROUP BY r.ingredient_id
                """;

        List<IngredientUsage> usages = jdbcTemplate.query(
                usageSql,
                (rs, rowNum) -> new IngredientUsage(
                        rs.getInt("ingredient_id"),
                        rs.getBigDecimal("total_used")
                ),
                orderId
        );

        if (usages.isEmpty()) {
            throw new IllegalStateException("Order has no items or recipe missing for its products");
        }

        String placeholders = String.join(",", Collections.nCopies(usages.size(), "?"));
        String lockSql = "SELECT ingredient_id, quantity FROM inventory WHERE ingredient_id IN (" + placeholders + ") FOR UPDATE";
        Object[] ids = usages.stream().map(u -> u.ingredientId).toArray();

        Map<Integer, BigDecimal> currentQty = new HashMap<>();
        jdbcTemplate.query(lockSql, rs -> {
            currentQty.put(rs.getInt("ingredient_id"), rs.getBigDecimal("quantity"));
        }, ids);

        for (IngredientUsage u : usages) {
            BigDecimal have = currentQty.get(u.ingredientId);
            if (have == null) {
                throw new IllegalStateException("Inventory missing for ingredient_id=" + u.ingredientId);
            }
            if (have.compareTo(u.totalUsed) < 0) {
                throw new IllegalStateException(
                        "Insufficient stock for ingredient_id=" + u.ingredientId +
                                " need=" + u.totalUsed + " have=" + have
                );
            }
        }

        for (IngredientUsage u : usages) {
            jdbcTemplate.update(
                    "UPDATE inventory SET quantity = quantity - ? WHERE ingredient_id = ?",
                    u.totalUsed, u.ingredientId
            );
        }

        orderRepository.updateStatus(orderId, "COMPLETED");
    }

    @Transactional
    public void removeOrderItem(int orderId, int productId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found"));

        if (!"CREATED".equals(order.getStatus())) {
            throw new IllegalStateException("Order not editable unless status=CREATED");
        }

        int affected = jdbcTemplate.update(
                "DELETE FROM order_item WHERE order_id = ? AND product_id = ?",
                orderId, productId
        );

        if (affected == 0) {
            throw new NoSuchElementException("Order item not found");
        }
    }

    public void cancelOrder(int orderId) {
        String sql = """
                UPDATE orders
                SET status = 'CANCELED'
                WHERE order_id = ? AND status = 'CREATED'
                """;
        int affected = jdbcTemplate.update(sql, orderId);
        if (affected == 0) {
            throw new IllegalStateException("Only CREATED order can be canceled");
        }
    }

    public OrderDetailResponse getOrderDetail(int orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found"));

        List<OrderItemView> items = orderItemRepository.findItemViewsByOrderId(orderId);

        List<OrderDetailResponse.Item> itemResponses = new ArrayList<>();
        for (OrderItemView item : items) {
            itemResponses.add(new OrderDetailResponse.Item(
                    item.getProductId(),
                    item.getProductName(),
                    item.getQuantity(),
                    item.getPriceCents()
            ));
        }

        return new OrderDetailResponse(
                order.getOrderId(),
                order.getCreatedAt(),
                order.getStatus(),
                itemResponses
        );
    }

    // ✅ 新：支持 from/to 的分页查询
    public List<Order> listOrders(String status, String from, String to, Integer limit, Integer offset) {
        return orderRepository.findOrders(status, from, to, limit, offset);
    }

    private static class IngredientUsage {
        final int ingredientId;
        final BigDecimal totalUsed;

        IngredientUsage(int ingredientId, BigDecimal totalUsed) {
            this.ingredientId = ingredientId;
            this.totalUsed = totalUsed;
        }
    }
}
