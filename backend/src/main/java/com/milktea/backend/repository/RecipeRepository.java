package com.milktea.backend.repository;

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


    public List<RecipeLine> findRecipeByProductId(int productId) {

        String sql = """
            SELECT r.ingredient_id,
                   i.name,
                   i.unit,
                   i.type,
                   r.qty_required
            FROM recipe r
            JOIN ingredient i ON i.ingredient_id = r.ingredient_id
            WHERE r.product_id = ?
            ORDER BY i.type, i.name
        """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            RecipeLine line = new RecipeLine();
            line.setIngredientId(rs.getInt("ingredient_id"));
            line.setIngredientName(rs.getString("name"));
            line.setUnit(rs.getString("unit"));
            line.setType(rs.getString("type")); 
            line.setQtyRequired(rs.getDouble("qty_required"));
            return line;
        }, productId);
    }


    public void replaceRecipe(int productId, List<RecipeLine> lines) {

        jdbcTemplate.update("DELETE FROM recipe WHERE product_id = ?", productId);

        String sql = """
            INSERT INTO recipe(product_id, ingredient_id, qty_required)
            VALUES (?, ?, ?)
        """;

        for (RecipeLine line : lines) {
            jdbcTemplate.update(sql,
                    productId,
                    line.getIngredientId(),
                    line.getQtyRequired()
            );
        }
    }
}
