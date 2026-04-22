package com.emit.feedback.service;

import com.emit.feedback.dto.academic.CourseElementDto;
import com.emit.feedback.dto.user.StudentProfileDto;
import java.util.List;

public interface StudentService {
    StudentProfileDto getCurrentStudentProfile();
    List<CourseElementDto> getMyCourses();
    void enrollCurrentStudent(Long ecId);
}
