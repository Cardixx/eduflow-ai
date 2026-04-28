package com.emit.feedback.controller;

import com.emit.feedback.dto.common.PageResponse;
import com.emit.feedback.dto.feedback.FeedbackDto;
import com.emit.feedback.dto.feedback.FeedbackRequest;
import com.emit.feedback.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/feedbacks")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping
    @PreAuthorize("hasRole('ETUDIANT')")
    public FeedbackDto submitFeedback(@Valid @RequestBody FeedbackRequest request) {
        return feedbackService.submitFeedback(request);
    }

    @GetMapping("/ec/{ecId}")
    @PreAuthorize("hasAnyRole('ENSEIGNANT','ADMIN')")
    public PageResponse<FeedbackDto> getFeedbackByEc(@PathVariable Long ecId,
                                                     @RequestParam(defaultValue = "0") int page,
                                                     @RequestParam(defaultValue = "10") int size) {
        return feedbackService.getFeedbackByEc(ecId, page, size);
    }

    @GetMapping("/teacher/me")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public PageResponse<FeedbackDto> getTeacherFeedback(@RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "10") int size) {
        return feedbackService.getFeedbackForCurrentTeacher(page, size);
    }

    @GetMapping("/student/me")
    @PreAuthorize("hasRole('ETUDIANT')")
    public PageResponse<FeedbackDto> getStudentFeedback(@RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "10") int size) {
        return feedbackService.getFeedbackForCurrentStudent(page, size);
    }
}
