package com.milktea.backend.repository;

import com.milktea.backend.model.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AnalyticsRepository {

    private final JdbcTemplate jdbcTemplate;

    public AnalyticsRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<TopProduct> findTopSellingProducts() {
        String sql = """
            SELECT p.name AS productName, SUM(oi.quantity) AS totalQuantitySold
            FROM order_item oi
            JOIN orders o ON oi.order_id = o.order_id
            JOIN product p ON oi.product_id = p.product_id
            WHERE o.status = 'COMPLETED'
            GROUP BY p.product_id, p.name
            ORDER BY totalQuantitySold DESC
            LIMIT 5
        """;
        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new TopProduct(rs.getString("productName"), rs.getInt("totalQuantitySold")));
    }

    public List<DailySale> findDailySalesLast7Days() {
        String sql = """
            SELECT DATE(o.created_at) AS saleDate, SUM(oi.price_cents) AS totalCents
            FROM orders o
            JOIN order_item oi ON o.order_id = oi.order_id
            WHERE o.status = 'COMPLETED'
              AND o.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(o.created_at)
            ORDER BY saleDate
        """;
        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new DailySale(rs.getDate("saleDate").toLocalDate(), rs.getInt("totalCents")));
    }

    public List<IngredientUsage> findMostConsumedIngredients() {
        String sql = """
            SELECT i.name AS ingredientName,
                   ROUND(
                       (SUM(r.qty_required * oi.quantity) / 
                        (SUM(r.qty_required * oi.quantity) + inv.quantity)) * 100, 2
                   ) AS totalQuantityUsed
            FROM order_item oi
            JOIN orders o ON oi.order_id = o.order_id
            JOIN recipe r ON oi.product_id = r.product_id
            JOIN ingredient i ON r.ingredient_id = i.ingredient_id
            JOIN inventory inv ON i.ingredient_id = inv.ingredient_id
            WHERE o.status = 'COMPLETED'
            GROUP BY i.ingredient_id, i.name, inv.quantity
            ORDER BY totalQuantityUsed DESC
            LIMIT 5
        """;
        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new IngredientUsage(rs.getString("ingredientName"), rs.getDouble("totalQuantityUsed")));
    }

    public List<LowStockAlert> findLowStockAlerts() {
        // Threshold = 500 for all ingredients (you can adjust per type if you like)
        String sql = """
            SELECT i.name AS ingredientName,
                   inv.quantity AS currentQuantity,
                   500.00 AS threshold
            FROM inventory inv
            JOIN ingredient i ON inv.ingredient_id = i.ingredient_id
            WHERE inv.quantity < 500.00
            ORDER BY inv.quantity ASC
        """;
        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new LowStockAlert(rs.getString("ingredientName"), rs.getDouble("currentQuantity"), rs.getDouble("threshold")));
    }
}