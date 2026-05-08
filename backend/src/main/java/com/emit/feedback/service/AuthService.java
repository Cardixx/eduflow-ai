package com.emit.feedback.service;

import com.emit.feedback.dto.auth.AuthResponse;
import com.emit.feedback.dto.auth.LoginRequest;
import com.emit.feedback.dto.auth.RegisterRequest;
import com.emit.feedback.dto.user.UserDto;
import com.emit.feedback.dto.user.UserUpdateRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserDto updateUser(Long id, UserUpdateRequest request);
}
