package com.emit.feedback.service;

import com.emit.feedback.dto.academic.CourseElementDto;
import com.emit.feedback.dto.academic.CourseElementUpsertRequest;
import com.emit.feedback.dto.user.TeacherProfileDto;
import java.util.List;

public interface TeacherService {
    TeacherProfileDto getCurrentTeacherProfile();
    List<CourseElementDto> getMyCourses();
    CourseElementDto createCourseElement(CourseElementUpsertRequest request);
    CourseElementDto updateCourseElement(Long ecId, CourseElementUpsertRequest request);
}
