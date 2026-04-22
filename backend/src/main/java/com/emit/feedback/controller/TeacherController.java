package com.emit.feedback.controller;

import com.emit.feedback.dto.academic.CourseElementDto;
import com.emit.feedback.dto.academic.CourseElementUpsertRequest;
import com.emit.feedback.dto.user.TeacherProfileDto;
import com.emit.feedback.service.TeacherService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ENSEIGNANT')")
public class TeacherController {

    private final TeacherService teacherService;

    @GetMapping("/me")
    public TeacherProfileDto getProfile() {
        return teacherService.getCurrentTeacherProfile();
    }

    @GetMapping("/me/courses")
    public List<CourseElementDto> getMyCourses() {
        return teacherService.getMyCourses();
    }

    @PostMapping("/me/courses")
    public CourseElementDto createCourse(@Valid @RequestBody CourseElementUpsertRequest request) {
        return teacherService.createCourseElement(request);
    }

    @PutMapping("/me/courses/{ecId}")
    public CourseElementDto updateCourse(@PathVariable Long ecId, @Valid @RequestBody CourseElementUpsertRequest request) {
        return teacherService.updateCourseElement(ecId, request);
    }
}
