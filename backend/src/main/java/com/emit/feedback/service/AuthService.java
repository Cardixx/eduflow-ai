package com.emit.feedback.service;

import com.emit.feedback.dto.auth.AuthResponse;
import com.emit.feedback.dto.auth.LoginRequest;
import com.emit.feedback.dto.auth.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
