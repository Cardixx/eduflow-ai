package com.emit.feedback.dto.user;

import com.emit.feedback.entity.enums.NotificationType;
import java.time.Instant;

public record NotificationDto(
        Long id,
        String title,
        String message,
        boolean read,
        NotificationType type,
        Instant createdAt
) {
}
