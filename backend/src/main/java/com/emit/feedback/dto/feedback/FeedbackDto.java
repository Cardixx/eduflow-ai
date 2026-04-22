package com.emit.feedback.dto.feedback;

import com.emit.feedback.entity.enums.SentimentType;
import java.time.Instant;

public record FeedbackDto(
        Long id,
        Long ecId,
        String ecName,
        String studentName,
        boolean anonymous,
        Integer rating,
        String comment,
        SentimentType sentiment,
        Double score,
        String summary,
        Instant createdAt
) {
}
