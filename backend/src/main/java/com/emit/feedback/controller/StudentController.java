package com.emit.feedback.controller;

import com.emit.feedback.dto.academic.CourseElementDto;
import com.emit.feedback.dto.academic.EnrollmentRequest;
import com.emit.feedback.dto.common.ApiMessage;
import com.emit.feedback.dto.user.StudentProfileDto;
import com.emit.feedback.service.StudentService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ETUDIANT')")
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/me")
    public StudentProfileDto getProfile() {
        return studentService.getCurrentStudentProfile();
    }

    @GetMapping("/me/courses")
    public List<CourseElementDto> getMyCourses() {
        return studentService.getMyCourses();
    }

    @PostMapping("/me/enrollments")
    public ApiMessage enroll(@Valid @RequestBody EnrollmentRequest request) {
        studentService.enrollCurrentStudent(request.ecId());
        return new ApiMessage("Enrollment successful");
    }
}
