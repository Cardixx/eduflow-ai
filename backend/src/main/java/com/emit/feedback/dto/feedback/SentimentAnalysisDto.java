package com.emit.feedback.dto.feedback;

import com.emit.feedback.entity.enums.SentimentType;

public record SentimentAnalysisDto(
        Long feedbackId,
        SentimentType sentiment,
        Double score,
        String summary
) {
}
