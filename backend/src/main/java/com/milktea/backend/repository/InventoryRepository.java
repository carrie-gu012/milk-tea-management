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
            SELECT i.ingredient_id, i.name, i.unit, inv.quantity
            FROM inventory inv
            JOIN ingredient i ON i.ingredient_id = inv.ingredient_id
            ORDER BY i.ingredient_id
        """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> new Inventory(
            rs.getInt("ingredient_id"),
            rs.getString("name"),
            rs.getString("unit"),
            rs.getDouble("quantity")
        ));
    }

    public int addStock(int ingredientId, double delta) {
        String sql = "UPDATE inventory SET quantity = quantity + ? WHERE ingredient_id = ?";
        return jdbcTemplate.update(sql, delta, ingredientId);
    }

    public int setQuantity(int ingredientId, double quantity) {
        String sql = "UPDATE inventory SET quantity = ? WHERE ingredient_id = ?";
        return jdbcTemplate.update(sql, quantity, ingredientId);
    }

    public int insertInventoryRow(int ingredientId, double quantity) {
        String sql = "INSERT INTO inventory (ingredient_id, quantity) VALUES (?, ?)";
        return jdbcTemplate.update(sql, ingredientId, quantity);
    }

    public int deleteInventoryRow(int ingredientId) {
        String sql = "DELETE FROM inventory WHERE ingredient_id = ?";
        return jdbcTemplate.update(sql, ingredientId);
    }
}
