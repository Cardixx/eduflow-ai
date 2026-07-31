package com.emit.feedback.dto.user;

import com.emit.feedback.entity.enums.RoleName;

public record UserDto(
        Long id,
        String email,
        String fullName,
        String avatarUrl,
        RoleName role,
        boolean active
) {
}
