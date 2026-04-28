package com.emit.feedback.controller;

import com.emit.feedback.dto.academic.CourseElementDto;
import com.emit.feedback.dto.academic.EnrollmentRequest;
import com.emit.feedback.dto.common.ApiMessage;
import com.emit.feedback.dto.user.StudentProfileDto;
import com.emit.feedback.service.StudentService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.emit.feedback.repository.EnrollmentRepository;
import com.emit.feedback.repository.FeedbackRepository;
import com.emit.feedback.service.impl.SecurityFacade;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ETUDIANT')")
public class StudentController {

    private final StudentService studentService;
    private final FeedbackRepository feedbackRepository;
    private final SecurityFacade securityFacade;
    private final EnrollmentRepository enrollmentRepository;

    @GetMapping("/me")
    public StudentProfileDto getProfile() {
        return studentService.getCurrentStudentProfile();
    }

    @GetMapping("/me/courses")
    public List<CourseElementDto> getMyCourses() {
        return studentService.getMyCourses();
    }

    @GetMapping("/me/stats")
    public Map<String, Object> getStats() {
        Long userId = securityFacade.currentUserId();
        long feedbackCount = feedbackRepository.countByStudentUserId(userId);
        long enrollmentCount = enrollmentRepository.countByStudentUserId(userId);
        return Map.of(
                "feedbackCount", feedbackCount,
                "enrollmentCount", enrollmentCount,
                "participationRate", enrollmentCount == 0 ? 0 : (feedbackCount * 100 / enrollmentCount)
        );
    }

    @GetMapping("/available-courses")
    public List<CourseElementDto> getAvailableCourses() {
        return studentService.getAvailableCoursesForEnrollment();
    }

    @PostMapping("/me/enrollments")
    public ApiMessage enroll(@Valid @RequestBody EnrollmentRequest request) {
        studentService.enrollCurrentStudent(request.ecId());
        return new ApiMessage("Enrollment successful");
    }
}
