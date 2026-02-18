package com.milktea.backend.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Map;

@Repository
public class IngredientRepository {
    private final JdbcTemplate jdbcTemplate;

    public IngredientRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public int insertIngredient(String name, String unit, String type) {
        String sql = "INSERT INTO ingredient (name, unit, type) VALUES (?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(conn -> {
            PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, name);
            ps.setString(2, unit);
            ps.setString(3, type);
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        if (key == null) throw new IllegalStateException("Failed to get generated ingredient_id");
        return key.intValue();
    }

    public int updateIngredient(int ingredientId, String name, String unit, String type) {
        String sql = "UPDATE ingredient SET name = ?, unit = ?, type = ? WHERE ingredient_id = ?";
        return jdbcTemplate.update(sql, name, unit, type, ingredientId);
    }

    public int deleteIngredient(int ingredientId) {
        String sql = "DELETE FROM ingredient WHERE ingredient_id = ?";
        return jdbcTemplate.update(sql, ingredientId);
    }

    // ✅ 新增：给 /ingredients 列表用（按 type/name 排序）
    public List<Map<String, Object>> findAll() {
        String sql = """
            SELECT ingredient_id, name, unit, type
            FROM ingredient
            ORDER BY type, name
        """;
        return jdbcTemplate.queryForList(sql);
    }
}
