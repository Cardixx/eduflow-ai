package com.emit.feedback.service.impl;

import com.emit.feedback.dto.user.NotificationDto;
import com.emit.feedback.entity.Notification;
import com.emit.feedback.exception.ResourceNotFoundException;
import com.emit.feedback.repository.NotificationRepository;
import com.emit.feedback.service.NotificationService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final SecurityFacade securityFacade;
    private final NotificationRepository notificationRepository;

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDto> getCurrentUserNotifications() {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(securityFacade.currentUser().getId()).stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (!notification.getUser().getId().equals(securityFacade.currentUser().getId())) {
            throw new ResourceNotFoundException("Notification not found");
        }
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    private NotificationDto toDto(Notification notification) {
        return new NotificationDto(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.isRead(),
                notification.getType(),
                notification.getCreatedAt()
        );
    }
}
