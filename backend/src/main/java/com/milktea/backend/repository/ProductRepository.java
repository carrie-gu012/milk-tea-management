package com.milktea.backend.repository;

import com.milktea.backend.model.Product;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

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
}
