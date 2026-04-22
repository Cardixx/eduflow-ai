package com.emit.feedback.dto.auth;

import com.emit.feedback.dto.user.UserDto;

public record AuthResponse(
        String accessToken,
        String tokenType,
        UserDto user
) {
}
