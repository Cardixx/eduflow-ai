package com.emit.feedback.dto.report;

import java.util.List;

public record ReportDto(
        Long ecId,
        String ecCode,
        String ecName,
        Double averageRating,
        long totalFeedback,
        long positive,
        long neutral,
        long negative,
        String summary,
        List<SentimentTrendPointDto> trend
) {
}
