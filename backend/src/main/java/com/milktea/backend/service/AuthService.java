package com.milktea.backend.service;

import com.milktea.backend.repository.AuthRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthRepository authRepository;

    public AuthService(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }

    public String loginRole(String username, String password) {
        if (authRepository.adminValid(username, password)) return "ADMIN";
        if (authRepository.staffValid(username, password)) return "STAFF";
        return null;
    }
}