package com.milktea.backend.repository;

import com.milktea.backend.model.RecentOrderItem;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class DashboardRepository {

    private final JdbcTemplate jdbcTemplate;

    public DashboardRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public int countTodayOrders() {
        String sql = """
            SELECT COUNT(*)
            FROM orders
            WHERE DATE(created_at) = CURDATE()
        """;
        Integer result = jdbcTemplate.queryForObject(sql, Integer.class);
        return result == null ? 0 : result;
    }

    public int sumTodayRevenueCents() {
        String sql = """
            SELECT COALESCE(SUM(oi.quantity * oi.price_cents), 0)
            FROM orders o
            JOIN order_item oi ON o.order_id = oi.order_id
            WHERE o.status = 'COMPLETED'
              AND DATE(o.created_at) = CURDATE()
        """;
        Integer result = jdbcTemplate.queryForObject(sql, Integer.class);
        return result == null ? 0 : result;
    }

    public int countLowStockItems() {
        String sql = """
            SELECT COUNT(*)
            FROM inventory
            WHERE quantity < 500
        """;
        Integer result = jdbcTemplate.queryForObject(sql, Integer.class);
        return result == null ? 0 : result;
    }

    public int countPendingOrders() {
        String sql = """
            SELECT COUNT(*)
            FROM orders
            WHERE status = 'CREATED'
        """;
        Integer result = jdbcTemplate.queryForObject(sql, Integer.class);
        return result == null ? 0 : result;
    }

    public List<RecentOrderItem> findRecentOrders(int limit) {
        String sql = """
            SELECT order_id, status, created_by
            FROM orders
            ORDER BY created_at DESC, order_id DESC
            LIMIT ?
        """;
        return jdbcTemplate.query(sql, ps -> ps.setInt(1, limit), (rs, rowNum) ->
            new RecentOrderItem(
                rs.getInt("order_id"),
                rs.getString("status"),
                rs.getString("created_by")
            )
        );
    }

    public List<String> findAlerts() {
        String sql = """
            SELECT CONCAT(i.name, ' is low in stock (', inv.quantity, ')') AS alert_text
            FROM inventory inv
            JOIN ingredient i ON inv.ingredient_id = i.ingredient_id
            WHERE inv.quantity < 500
            ORDER BY inv.quantity ASC
            LIMIT 5
        """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> rs.getString("alert_text"));
    }
}