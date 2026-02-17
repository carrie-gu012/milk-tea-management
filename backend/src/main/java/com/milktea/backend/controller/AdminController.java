package com.milktea.backend.controller;

import com.milktea.backend.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    public static class CreateStaffRequest {
        public String username;
        public String password;
    }

    private void requireAdmin(HttpServletRequest request) {
        String role = request.getHeader("X-ROLE");
        if (role == null || !"ADMIN".equalsIgnoreCase(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No permission");
        }
    }

    @PostMapping("/staff")
    public Map<String, Object> createStaff(@RequestBody CreateStaffRequest req,
                                          HttpServletRequest request) {
        requireAdmin(request);

        if (req == null || req.username == null || req.password == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing username/password");
        }

        String adminUsername = request.getHeader("X-USER");
        if (adminUsername == null || adminUsername.isBlank()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Missing admin identity");
        }

        int staffId = adminService.createStaff(req.username, req.password, adminUsername);
        if (staffId <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to create staff");
        }

        return Map.of("staffId", staffId, "username", req.username);
    }
}
