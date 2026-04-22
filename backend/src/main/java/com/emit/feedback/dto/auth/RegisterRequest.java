package com.emit.feedback.dto.auth;

import com.emit.feedback.entity.enums.RoleName;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @Email @NotBlank String email,
        @NotBlank @Size(min = 6, max = 100) String password,
        @NotBlank String fullName,
        String avatarUrl,
        @NotNull RoleName role,
        String studentNumber,
        String teacherCode,
        Long niveauId
) {
}
