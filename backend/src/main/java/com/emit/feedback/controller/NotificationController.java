package com.emit.feedback.controller;

import com.emit.feedback.dto.common.ApiMessage;
import com.emit.feedback.dto.user.NotificationDto;
import com.emit.feedback.service.NotificationService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/me")
    public List<NotificationDto> getMyNotifications() {
        return notificationService.getCurrentUserNotifications();
    }

    @PatchMapping("/{notificationId}/read")
    public ApiMessage markAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
        return new ApiMessage("Notification marked as read");
    }
}
