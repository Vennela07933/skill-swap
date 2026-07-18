package com.skillswap.service;

import com.skillswap.dto.NotificationDto;
import org.springframework.data.domain.Page;

public interface NotificationService {
    Page<NotificationDto> getUserNotifications(Long userId, int page, int size);
    void markAsRead(Long notificationId, Long userId);
}
