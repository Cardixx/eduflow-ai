package com.emit.feedback.service.impl;

import com.emit.feedback.dto.common.PageResponse;
import com.emit.feedback.dto.feedback.FeedbackDto;
import com.emit.feedback.dto.feedback.FeedbackRequest;
import com.emit.feedback.entity.CourseElement;
import com.emit.feedback.entity.Feedback;
import com.emit.feedback.entity.Notification;
import com.emit.feedback.entity.SentimentAnalysis;
import com.emit.feedback.entity.Student;
import com.emit.feedback.entity.Teacher;
import com.emit.feedback.entity.enums.NotificationType;
import com.emit.feedback.exception.BadRequestException;
import com.emit.feedback.exception.ResourceNotFoundException;
import com.emit.feedback.repository.CourseElementRepository;
import com.emit.feedback.repository.FeedbackRepository;
import com.emit.feedback.repository.NotificationRepository;
import com.emit.feedback.repository.SentimentAnalysisRepository;
import com.emit.feedback.repository.StudentRepository;
import com.emit.feedback.repository.TeacherRepository;
import com.emit.feedback.service.FeedbackService;
import com.emit.feedback.service.SentimentAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {

    private final SecurityFacade securityFacade;
    private final FeedbackRepository feedbackRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final CourseElementRepository courseElementRepository;
    private final SentimentAnalysisRepository sentimentAnalysisRepository;
    private final SentimentAnalysisService sentimentAnalysisService;
    private final NotificationRepository notificationRepository;

    @Override
    @Transactional
    public FeedbackDto submitFeedback(FeedbackRequest request) {
        Student student = studentRepository.findByUserId(securityFacade.currentUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        CourseElement ec = courseElementRepository.findById(request.ecId())
                .orElseThrow(() -> new ResourceNotFoundException("EC not found"));

        Feedback feedback = new Feedback();
        feedback.setStudent(student);
        feedback.setCourseElement(ec);
        feedback.setRating(request.rating());
        feedback.setComment(request.comment());
        feedback.setAnonymous(request.anonymous());
        Feedback savedFeedback = feedbackRepository.save(feedback);

        SentimentAnalysis analysis = sentimentAnalysisService.analyze(savedFeedback);
        SentimentAnalysis savedAnalysis = sentimentAnalysisRepository.save(analysis);
        savedFeedback.setSentimentAnalysis(savedAnalysis);

        createTeacherNotification(ec.getTeacher(), ec);
        return toDto(savedFeedback);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<FeedbackDto> getFeedbackByEc(Long ecId, int page, int size) {
        Page<Feedback> result = feedbackRepository.findByCourseElementId(ecId, PageRequest.of(page, size));
        return toPageResponse(result);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<FeedbackDto> getFeedbackForCurrentTeacher(int page, int size) {
        Teacher teacher = teacherRepository.findByUserId(securityFacade.currentUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher profile not found"));
        Page<Feedback> result = feedbackRepository.findByCourseElementTeacherId(teacher.getId(), PageRequest.of(page, size));
        return toPageResponse(result);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<FeedbackDto> getFeedbackForCurrentStudent(int page, int size) {
        Student student = studentRepository.findByUserId(securityFacade.currentUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        Page<Feedback> result = feedbackRepository.findByStudentId(student.getId(), PageRequest.of(page, size));
        return toPageResponse(result);
    }

    private PageResponse<FeedbackDto> toPageResponse(Page<Feedback> result) {
        return new PageResponse<>(
                result.getContent().stream().map(this::toDto).toList(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages()
        );
    }

    private FeedbackDto toDto(Feedback feedback) {
        SentimentAnalysis analysis = feedback.getSentimentAnalysis();
        return new FeedbackDto(
                feedback.getId(),
                feedback.getCourseElement().getId(),
                feedback.getCourseElement().getName(),
                feedback.isAnonymous() ? "Anonymous" : feedback.getStudent().getUser().getFullName(),
                feedback.isAnonymous(),
                feedback.getRating(),
                feedback.getComment(),
                analysis != null ? analysis.getSentiment() : null,
                analysis != null ? analysis.getScore() : null,
                analysis != null ? analysis.getSummary() : null,
                feedback.getCreatedAt()
        );
    }

    private void createTeacherNotification(Teacher teacher, CourseElement ec) {
        Notification notification = new Notification();
        notification.setUser(teacher.getUser());
        notification.setTitle("New feedback received");
        notification.setMessage("A new feedback has been submitted for EC " + ec.getCode() + " - " + ec.getName());
        notification.setType(NotificationType.INFO);
        notification.setRead(false);
        notificationRepository.save(notification);
    }
}
