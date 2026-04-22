package com.emit.feedback.dto.academic;

public record CourseElementDto(
        Long id,
        String code,
        String name,
        String description,
        Integer hours,
        Long ueId,
        Long teacherId,
        String teacherName
) {
}
