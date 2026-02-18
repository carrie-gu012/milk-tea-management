package com.milktea.backend.controller;

import com.milktea.backend.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ====== DTOs ======
    public static class CreateStaffRequest {
        public String username;
        public String password;
    }

    public static class UpdateStaffRequest {
        public String username; // for renaming
    }

    public static class UpdateStaffPasswordRequest {
        public String password; // for resetting password
    }

    // ====== Auth Guard ======
    private void requireAdmin(HttpServletRequest request) {
        String role = request.getHeader("X-ROLE");
        if (role == null || !"ADMIN".equalsIgnoreCase(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No permission");
        }
    }

    // ====== Create ======
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

    // ====== Read (List) ======
    @GetMapping("/staff")
    public List<AdminService.StaffView> listStaff(HttpServletRequest request) {
        requireAdmin(request);
        return adminService.listStaff();
    }

    // ====== Update (Rename) ======
    @PatchMapping("/staff/{staffId}")
    public Map<String, Object> updateStaffUsername(@PathVariable int staffId,
                                                   @RequestBody UpdateStaffRequest req,
                                                   HttpServletRequest request) {
        requireAdmin(request);

        if (req == null || req.username == null || req.username.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing username");
        }

        adminService.updateStaffUsername(staffId, req.username.trim());
        return Map.of("ok", true);
    }

    // ====== Update (Reset Password) ======
    @PatchMapping("/staff/{staffId}/password")
    public Map<String, Object> updateStaffPassword(@PathVariable int staffId,
                                                   @RequestBody UpdateStaffPasswordRequest req,
                                                   HttpServletRequest request) {
        requireAdmin(request);

        if (req == null || req.password == null || req.password.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing password");
        }

        adminService.updateStaffPassword(staffId, req.password);
        return Map.of("ok", true);
    }

    // ====== Delete (Hard delete) ======
    @DeleteMapping("/staff/{staffId}")
    public Map<String, Object> deleteStaff(@PathVariable int staffId,
                                           HttpServletRequest request) {
        requireAdmin(request);

        adminService.deleteStaff(staffId);
        return Map.of("ok", true);
    }
}
