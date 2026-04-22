package com.emit.feedback.dto.report;

import java.time.LocalDate;

public record SentimentTrendPointDto(
        LocalDate date,
        long positive,
        long neutral,
        long negative
) {
}
