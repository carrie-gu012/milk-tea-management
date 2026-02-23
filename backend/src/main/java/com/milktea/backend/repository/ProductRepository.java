package com.milktea.backend.repository;

import com.milktea.backend.model.Product;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class ProductRepository {

    private final JdbcTemplate jdbcTemplate;

    public ProductRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Product> findAll() {
        String sql = """
                SELECT product_id, name, price_cents, is_active
                FROM product
                ORDER BY product_id
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> new Product(
                rs.getInt("product_id"),
                rs.getString("name"),
                rs.getInt("price_cents"),
                rs.getBoolean("is_active")
        ));
    }

    // ✅ 用于 GET /products/{id}
    public Product findById(int productId) {
        String sql = """
                SELECT product_id, name, price_cents, is_active
                FROM product
                WHERE product_id = ?
                """;
        try {
            return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> new Product(
                    rs.getInt("product_id"),
                    rs.getString("name"),
                    rs.getInt("price_cents"),
                    rs.getBoolean("is_active")
            ), productId);
        } catch (EmptyResultDataAccessException e) {
            // 你也可以改成抛自定义异常，然后 Controller 返回 404
            throw new RuntimeException("Product not found: " + productId);
        }
    }

    // ✅ 用于 POST /products：插入并返回自增 product_id
    public int insert(String name, int priceCents, boolean isActive) {
        String sql = """
                INSERT INTO product(name, price_cents, is_active)
                VALUES (?, ?, ?)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, name);
            ps.setInt(2, priceCents);
            ps.setBoolean(3, isActive);
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        if (key == null) {
            throw new RuntimeException("Failed to create product: no generated key returned");
        }
        return key.intValue();
    }

    // ✅ PUT /products/{id}
    public int update(int productId, String name, int priceCents, boolean isActive) {

        String sql = """
                UPDATE product
                SET name = ?, price_cents = ?, is_active = ?
                WHERE product_id = ?
                """;

        return jdbcTemplate.update(
                sql,
                name,
                priceCents,
                isActive,
                productId
        );
    }
    


    // ✅ 用于 DELETE /products/{id}
    public int deleteById(int productId) {
        String sql = "DELETE FROM product WHERE product_id = ?";
        return jdbcTemplate.update(sql, productId);
    }
}
