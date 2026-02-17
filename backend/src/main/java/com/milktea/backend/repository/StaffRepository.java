package com.milktea.backend.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class StaffRepository {

    private final JdbcTemplate jdbcTemplate;

    public StaffRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public int createStaff(String username, String password, int createdByAdminId) {
        jdbcTemplate.update(
                "INSERT INTO staff (username, password_hash, is_active, created_by_admin_id) VALUES (?,?,1,?)",
                username, password, createdByAdminId
        );
        Integer id = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);
        return id == null ? -1 : id;
    }
}
