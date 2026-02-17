package com.milktea.backend.controller;

import com.milktea.backend.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    public static class LoginRequest {
        public String username;
        public String password;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest req) {
        if (req == null || req.username == null || req.password == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing username/password");
        }

        String role = authService.loginRole(req.username, req.password);
        if (role == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        // 前端只需要 role + username
        return Map.of(
                "role", role,
                "username", req.username
        );
    }
}
