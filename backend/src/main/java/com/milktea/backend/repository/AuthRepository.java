package com.milktea.backend.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class AuthRepository {

    private final JdbcTemplate jdbcTemplate;

    public AuthRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean adminValid(String username, String password) {
        Integer cnt = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM admin WHERE username=? AND password_hash=? AND is_active=1",
                Integer.class, username, password
        );
        return cnt != null && cnt > 0;
    }

    public boolean staffValid(String username, String password) {
        Integer cnt = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM staff WHERE username=? AND password_hash=? AND is_active=1",
                Integer.class, username, password
        );
        return cnt != null && cnt > 0;
    }

    public Integer findAdminIdByUsername(String username) {
        return jdbcTemplate.queryForObject(
                "SELECT admin_id FROM admin WHERE username=? AND is_active=1",
                Integer.class, username
        );
    }
}
