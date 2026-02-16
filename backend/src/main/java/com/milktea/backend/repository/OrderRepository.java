package com.milktea.backend.repository;

import com.milktea.backend.model.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class OrderRepository {

    private final JdbcTemplate jdbcTemplate;

    public OrderRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ✅ 改：create(createdBy)
    public int create(String createdBy) {
        String sql = "INSERT INTO orders (status, created_by) VALUES ('CREATED', ?)";
        KeyHolder kh = new GeneratedKeyHolder();

        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, createdBy);
            return ps;
        }, kh);

        Number key = kh.getKey();
        if (key == null) throw new IllegalStateException("Failed to create order");
        return key.intValue();
    }

    public Optional<Order> findById(int orderId) {
        String sql = """
                SELECT order_id, created_at, status, created_by
                FROM orders
                WHERE order_id = ?
                """;
        List<Order> rows = jdbcTemplate.query(sql, (rs, rowNum) -> new Order(
                rs.getInt("order_id"),
                rs.getTimestamp("created_at").toLocalDateTime(),
                rs.getString("status"),
                rs.getString("created_by")
        ), orderId);
        return rows.stream().findFirst();
    }

    public Optional<Order> findByIdForUpdate(int orderId) {
        String sql = """
                SELECT order_id, created_at, status, created_by
                FROM orders
                WHERE order_id = ?
                FOR UPDATE
                """;
        List<Order> rows = jdbcTemplate.query(sql, (rs, rowNum) -> new Order(
                rs.getInt("order_id"),
                rs.getTimestamp("created_at").toLocalDateTime(),
                rs.getString("status"),
                rs.getString("created_by")
        ), orderId);
        return rows.stream().findFirst();
    }

    public int updateStatus(int orderId, String status) {
        return jdbcTemplate.update(
                "UPDATE orders SET status = ? WHERE order_id = ?",
                status, orderId
        );
    }

    public List<Order> findOrders(String status, Integer limit, Integer offset) {

        StringBuilder sql = new StringBuilder("""
                SELECT order_id, created_at, status, created_by
                FROM orders
                """);

        List<Object> params = new ArrayList<>();

        if (status != null) {
            sql.append(" WHERE status = ? ");
            params.add(status);
        }

        sql.append(" ORDER BY created_at DESC ");

        if (limit != null) {
            sql.append(" LIMIT ? ");
            params.add(limit);
        }

        if (offset != null) {
            sql.append(" OFFSET ? ");
            params.add(offset);
        }

        return jdbcTemplate.query(
                sql.toString(),
                (rs, rowNum) -> new Order(
                        rs.getInt("order_id"),
                        rs.getTimestamp("created_at").toLocalDateTime(),
                        rs.getString("status"),
                        rs.getString("created_by")
                ),
                params.toArray()
        );
    }
}
