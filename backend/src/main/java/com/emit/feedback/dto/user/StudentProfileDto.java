package com.emit.feedback.dto.user;

public record StudentProfileDto(
        Long id,
        String studentNumber,
        String fullName,
        String email,
        String niveau,
        String academicYear
) {
}
