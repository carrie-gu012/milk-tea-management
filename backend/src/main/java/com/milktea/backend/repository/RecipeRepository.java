package com.milktea.backend.repository;

import com.milktea.backend.dto.RecipeLine;
import com.milktea.backend.dto.RecipeLine;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RecipeRepository {

    private final JdbcTemplate jdbcTemplate;

    public RecipeRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ⭐ 查询某 product 的 recipe
    public List<RecipeLine> findRecipeByProductId(int productId) {

        String sql = """
            SELECT r.ingredient_id, i.name, i.unit, r.qty_required
            FROM recipe r
            JOIN ingredient i ON i.ingredient_id = r.ingredient_id
            WHERE r.product_id = ?
            ORDER BY i.name
        """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            RecipeLine line = new RecipeLine();
            line.setIngredientId(rs.getInt("ingredient_id"));
            line.setIngredientName(rs.getString("name"));
            line.setUnit(rs.getString("unit"));
            line.setQtyRequired(rs.getDouble("qty_required"));
            return line;
        }, productId);
    }

    // ⭐ 批量替换 recipe（create or update 都可以用）
    public void replaceRecipe(int productId, List<RecipeLine> lines) {

        // 删除旧 recipe
        jdbcTemplate.update(
                "DELETE FROM recipe WHERE product_id = ?",
                productId
        );

        // 插入新 recipe
        String sql = """
            INSERT INTO recipe(product_id, ingredient_id, qty_required)
            VALUES (?, ?, ?)
        """;

        for (RecipeLine line : lines) {
            jdbcTemplate.update(
                    sql,
                    productId,
                    line.getIngredientId(),
                    line.getQtyRequired()
            );
        }
    }
}
