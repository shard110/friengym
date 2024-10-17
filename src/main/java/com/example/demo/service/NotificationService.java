package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Notification;
import com.example.demo.entity.User;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.repository.UserRepository;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    // 특정 사용자의 알림 목록 가져오기
    public List<Notification> getNotifications(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user);
    }

    // 팔로우 알림 생성
    public void createFollowNotification(User sender, User recipient) {
        Notification notification = new Notification();
        notification.setSender(sender);
        notification.setRecipient(recipient);
        notification.setType(Notification.NotificationType.FOLLOW);  // FOLLOW 타입 설정
        notificationRepository.save(notification);
    }

    // 알림 읽음 처리
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    // 읽지 않은 알림 수 가져오기
    public int getUnreadCount(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.countByRecipientAndIsReadFalse(user);
    }
}