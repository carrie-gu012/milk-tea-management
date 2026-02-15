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
}
