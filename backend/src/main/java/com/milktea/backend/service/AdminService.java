package com.milktea.backend.service;

import com.milktea.backend.repository.AuthRepository;
import com.milktea.backend.repository.StaffRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final AuthRepository authRepository;
    private final StaffRepository staffRepository;

    public AdminService(AuthRepository authRepository, StaffRepository staffRepository) {
        this.authRepository = authRepository;
        this.staffRepository = staffRepository;
    }

    public int createStaff(String staffUsername, String staffPassword, String adminUsername) {
        Integer adminId = authRepository.findAdminIdByUsername(adminUsername);
        if (adminId == null) return -1;
        return staffRepository.createStaff(staffUsername, staffPassword, adminId);
    }
}
