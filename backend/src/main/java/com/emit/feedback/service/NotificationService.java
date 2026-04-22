package com.emit.feedback.service;

import com.emit.feedback.dto.user.NotificationDto;
import java.util.List;

public interface NotificationService {
    List<NotificationDto> getCurrentUserNotifications();
    void markAsRead(Long notificationId);
}
