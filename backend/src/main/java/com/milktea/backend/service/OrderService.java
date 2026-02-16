package com.milktea.backend.service;

import com.milktea.backend.model.Order;
import com.milktea.backend.repository.OrderItemRepository;
import com.milktea.backend.repository.OrderRepository;
import com.milktea.backend.repository.OrderItemRepository.OrderItemView;
import com.milktea.backend.dto.OrderDetailResponse;                     

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

    public int createOrder() {
        return orderRepository.create();
    }

    public void addOrderItem(int orderId, int productId, int quantity) {
        if (quantity <= 0) throw new IllegalArgumentException("quantity must be > 0");

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found"));

        if (!"CREATED".equals(order.getStatus())) {
            throw new IllegalStateException("Order not editable unless status=CREATED");
        }

        // product 必须 active，取价格写入 order_item.price_cents
        Integer priceCents = jdbcTemplate.query(
                "SELECT price_cents FROM product WHERE product_id = ? AND is_active = 1",
                rs -> rs.next() ? rs.getInt("price_cents") : null,
                productId
        );
        if (priceCents == null) throw new NoSuchElementException("Product not found or inactive");

        orderItemRepository.upsertAddQuantity(orderId, productId, quantity, priceCents);
    }

    /**
     * ✅ 订单完成才扣库存
     * CREATED -> COMPLETED
     * 事务内：锁订单 -> 计算原料用量 -> 锁库存行 -> 校验 -> 扣库存 -> 更新状态
     */
    @Transactional
    public void completeOrder(int orderId) {

        // 1) 锁订单行，避免并发重复完成
        Order order = orderRepository.findByIdForUpdate(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found"));

        if ("COMPLETED".equals(order.getStatus())) {
            throw new IllegalStateException("Order already completed");
        }
        if ("CANCELLED".equals(order.getStatus())) {
            throw new IllegalStateException("Cancelled order cannot be completed");
        }
        if (!"CREATED".equals(order.getStatus())) {
            throw new IllegalStateException("Only CREATED order can be completed");
        }

        // 2) 根据订单项 + recipe 计算每种 ingredient 总消耗量（DECIMAL）
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
            // 订单没有 item，或者 item 的 product 没配 recipe
            throw new IllegalStateException("Order has no items or recipe missing for its products");
        }

        // 3) 锁库存行：SELECT ... FOR UPDATE
        String placeholders = String.join(",", Collections.nCopies(usages.size(), "?"));
        String lockSql = "SELECT ingredient_id, quantity FROM inventory WHERE ingredient_id IN (" + placeholders + ") FOR UPDATE";
        Object[] ids = usages.stream().map(u -> u.ingredientId).toArray();

        Map<Integer, BigDecimal> currentQty = new HashMap<>();
        jdbcTemplate.query(lockSql, rs -> {
            currentQty.put(rs.getInt("ingredient_id"), rs.getBigDecimal("quantity"));
        }, ids);

        // 4) 校验库存足够
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

        // 5) 扣库存
        for (IngredientUsage u : usages) {
            jdbcTemplate.update(
                    "UPDATE inventory SET quantity = quantity - ? WHERE ingredient_id = ?",
                    u.totalUsed, u.ingredientId
            );
        }

        // 6) 更新订单状态
        orderRepository.updateStatus(orderId, "COMPLETED");
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


    

    // 原料用量结构
    private static class IngredientUsage {
        final int ingredientId;
        final BigDecimal totalUsed;

        IngredientUsage(int ingredientId, BigDecimal totalUsed) {
            this.ingredientId = ingredientId;
            this.totalUsed = totalUsed;
        }
    }
}
