package com.milktea.backend.repository;

import com.milktea.backend.model.OrderItem;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class OrderItemRepository {

    private final JdbcTemplate jdbcTemplate;

    public OrderItemRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void upsertAddQuantity(int orderId, int productId, int addQty, int priceCents) {
        String sql = """
                INSERT INTO order_item (order_id, product_id, quantity, price_cents)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    quantity = quantity + VALUES(quantity),
                    price_cents = VALUES(price_cents)
                """;
        jdbcTemplate.update(sql, orderId, productId, addQty, priceCents);
    }

    public List<OrderItem> findByOrderId(int orderId) {
        String sql = """
                SELECT order_id, product_id, quantity, price_cents
                FROM order_item
                WHERE order_id = ?
                ORDER BY product_id
                """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> new OrderItem(
                rs.getInt("order_id"),
                rs.getInt("product_id"),
                rs.getInt("quantity"),
                rs.getInt("price_cents")
        ), orderId);
    }

    // ✅ 新增：带 product name 的查询（用于订单详情）
    public List<OrderItemView> findItemViewsByOrderId(int orderId) {
        String sql = """
                SELECT oi.product_id,
                       p.name AS product_name,
                       oi.quantity,
                       oi.price_cents
                FROM order_item oi
                JOIN product p ON p.product_id = oi.product_id
                WHERE oi.order_id = ?
                ORDER BY oi.product_id
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> new OrderItemView(
                rs.getInt("product_id"),
                rs.getString("product_name"),
                rs.getInt("quantity"),
                rs.getInt("price_cents")
        ), orderId);
    }

    // ✅ 内部 View 类
    public static class OrderItemView {
        private final int productId;
        private final String productName;
        private final int quantity;
        private final int priceCents;

        public OrderItemView(int productId, String productName, int quantity, int priceCents) {
            this.productId = productId;
            this.productName = productName;
            this.quantity = quantity;
            this.priceCents = priceCents;
        }

        public int getProductId() { return productId; }
        public String getProductName() { return productName; }
        public int getQuantity() { return quantity; }
        public int getPriceCents() { return priceCents; }
    }
}
