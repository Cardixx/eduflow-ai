package com.emit.feedback.service.impl;

import com.emit.feedback.dto.report.ReportDto;
import com.emit.feedback.dto.report.SentimentTrendPointDto;
import com.emit.feedback.entity.CourseElement;
import com.emit.feedback.entity.Feedback;
import com.emit.feedback.entity.Report;
import com.emit.feedback.entity.SentimentAnalysis;
import com.emit.feedback.entity.enums.ReportType;
import com.emit.feedback.entity.enums.SentimentType;
import com.emit.feedback.exception.ResourceNotFoundException;
import com.emit.feedback.repository.CourseElementRepository;
import com.emit.feedback.repository.FeedbackRepository;
import com.emit.feedback.repository.ReportRepository;
import com.emit.feedback.repository.SentimentAnalysisRepository;
import com.emit.feedback.service.ReportService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.ZoneOffset;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final CourseElementRepository courseElementRepository;
    private final FeedbackRepository feedbackRepository;
    private final SentimentAnalysisRepository sentimentAnalysisRepository;
    private final ReportRepository reportRepository;
    private final SecurityFacade securityFacade;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public ReportDto generateEcReport(Long ecId) {
        CourseElement ec = courseElementRepository.findById(ecId)
                .orElseThrow(() -> new ResourceNotFoundException("EC not found"));
        List<Feedback> feedbacks = feedbackRepository.findByCourseElementId(ecId);
        List<SentimentAnalysis> analyses = sentimentAnalysisRepository.findByFeedbackCourseElementId(ecId);

        long positive = analyses.stream().filter(a -> a.getSentiment() == SentimentType.POSITIVE).count();
        long neutral = analyses.stream().filter(a -> a.getSentiment() == SentimentType.NEUTRAL).count();
        long negative = analyses.stream().filter(a -> a.getSentiment() == SentimentType.NEGATIVE).count();
        double averageRating = feedbackRepository.averageRating(ecId) == null ? 0.0 : feedbackRepository.averageRating(ecId);

        List<SentimentTrendPointDto> trend = feedbacks.stream()
                .collect(Collectors.groupingBy(f -> f.getCreatedAt().atZone(ZoneOffset.UTC).toLocalDate()))
                .entrySet().stream()
                .map(entry -> {
                    long p = entry.getValue().stream().filter(f -> sentimentOf(f) == SentimentType.POSITIVE).count();
                    long n = entry.getValue().stream().filter(f -> sentimentOf(f) == SentimentType.NEUTRAL).count();
                    long ng = entry.getValue().stream().filter(f -> sentimentOf(f) == SentimentType.NEGATIVE).count();
                    return new SentimentTrendPointDto(entry.getKey(), p, n, ng);
                })
                .sorted(Comparator.comparing(SentimentTrendPointDto::date))
                .toList();

        String summary = buildSummary(averageRating, positive, neutral, negative);
        ReportDto dto = new ReportDto(ec.getId(), ec.getCode(), ec.getName(), averageRating, feedbacks.size(),
                positive, neutral, negative, summary, trend);

        Report report = new Report();
        report.setType(ReportType.EC_SUMMARY);
        report.setReferenceCode(ec.getCode());
        try {
            report.setPayload(objectMapper.writeValueAsString(dto));
        } catch (Exception e) {
            report.setPayload("{}");
        }
        report.setGeneratedBy(securityFacade.currentUser());
        reportRepository.save(report);
        return dto;
    }

    private SentimentType sentimentOf(Feedback feedback) {
        return feedback.getSentimentAnalysis() == null ? SentimentType.NEUTRAL : feedback.getSentimentAnalysis().getSentiment();
    }

    private String buildSummary(double averageRating, long positive, long neutral, long negative) {
        if (positive >= neutral && positive >= negative) {
            return "Overall sentiment is positive with an average rating of %.2f.".formatted(averageRating);
        }
        if (negative > positive) {
            return "The EC needs attention. Negative feedback is currently dominant.";
        }
        return "Student sentiment is mixed and should be monitored over time.";
    }
}
