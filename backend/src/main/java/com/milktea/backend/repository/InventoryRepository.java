package com.milktea.backend.repository;

import com.milktea.backend.model.Inventory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class InventoryRepository {

    private final JdbcTemplate jdbcTemplate;

    public InventoryRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Inventory> findAll() {
        String sql = """
                SELECT product_id, quantity, low_stock_threshold
                FROM inventory
                ORDER BY product_id
                """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> new Inventory(
                rs.getInt("product_id"),
                rs.getInt("quantity"),
                rs.getInt("low_stock_threshold")
        ));
    }

    public int updateQuantity(int productId, int newQuantity) {
        String sql = "UPDATE inventory SET quantity = ? WHERE product_id = ?";
        return jdbcTemplate.update(sql, newQuantity, productId);
    }

    public int addStock(int productId, int delta) {
        String sql = "UPDATE inventory SET quantity = quantity + ? WHERE product_id = ?";
        return jdbcTemplate.update(sql, delta, productId);
    }

    public List<Inventory> findLowStock() {
        String sql = """
                SELECT product_id, quantity, low_stock_threshold
                FROM inventory
                WHERE quantity <= low_stock_threshold
                ORDER BY quantity ASC
                """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> new Inventory(
                rs.getInt("product_id"),
                rs.getInt("quantity"),
                rs.getInt("low_stock_threshold")
        ));
    }
}
