package com.milktea.backend.service;

import com.milktea.backend.repository.AuthRepository;
import com.milktea.backend.repository.StaffRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AdminService {

    private final AuthRepository authRepository;
    private final StaffRepository staffRepository;

    public AdminService(AuthRepository authRepository, StaffRepository staffRepository) {
        this.authRepository = authRepository;
        this.staffRepository = staffRepository;
    }

    // 给 AdminController 直接返回用（JSON 会长这样：{staffId, username, active}）
    public record StaffView(int staffId, String username, boolean active) {}

    public int createStaff(String staffUsername, String staffPassword, String adminUsername) {
        Integer adminId = authRepository.findAdminIdByUsername(adminUsername);
        if (adminId == null) return -1;
        return staffRepository.createStaff(staffUsername, staffPassword, adminId);
    }

    public List<StaffView> listStaff() {
        return staffRepository.findAll();
    }

    public void updateStaffUsername(int staffId, String newUsername) {
        if (!staffRepository.existsById(staffId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Staff not found");
        }

        try {
            int n = staffRepository.updateUsername(staffId, newUsername);
            if (n != 1) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Update failed");
            }
        } catch (DuplicateKeyException dup) {
            // username UNIQUE 冲突
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already exists");
        }
    }

    public void updateStaffPassword(int staffId, String newPassword) {
        if (!staffRepository.existsById(staffId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Staff not found");
        }
        int n = staffRepository.updatePassword(staffId, newPassword);
        if (n != 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Update failed");
        }
    }

    public void deleteStaff(int staffId) {
        if (!staffRepository.existsById(staffId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Staff not found");
        }
        int n = staffRepository.deleteById(staffId);
        if (n != 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Delete failed");
        }
    }
}
