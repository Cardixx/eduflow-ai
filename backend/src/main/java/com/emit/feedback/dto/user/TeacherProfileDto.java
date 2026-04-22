package com.emit.feedback.dto.user;

public record TeacherProfileDto(
        Long id,
        String teacherCode,
        String fullName,
        String email,
        String department
) {
}
