package com.milktea.backend.repository;

import com.milktea.backend.service.AdminService.StaffView;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

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

    public boolean existsById(int staffId) {
        Integer c = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM staff WHERE staff_id = ?",
                Integer.class,
                staffId
        );
        return c != null && c > 0;
    }

    public List<StaffView> findAll() {
        String sql = """
                SELECT staff_id, username, is_active
                FROM staff
                ORDER BY staff_id
                """;
        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new StaffView(
                        rs.getInt("staff_id"),
                        rs.getString("username"),
                        rs.getInt("is_active") == 1
                )
        );
    }

    public int updateUsername(int staffId, String newUsername) {
        return jdbcTemplate.update(
                "UPDATE staff SET username = ? WHERE staff_id = ?",
                newUsername, staffId
        );
    }

    public int updatePassword(int staffId, String newPassword) {
        return jdbcTemplate.update(
                "UPDATE staff SET password_hash = ? WHERE staff_id = ?",
                newPassword, staffId
        );
    }

    public int deleteById(int staffId) {
        return jdbcTemplate.update(
                "DELETE FROM staff WHERE staff_id = ?",
                staffId
        );
    }
}
