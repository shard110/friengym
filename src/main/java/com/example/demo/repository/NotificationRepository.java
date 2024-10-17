package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Notification;
import com.example.demo.entity.User;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // 특정 사용자에 대한 알림 목록 조회
    List<Notification> findByRecipientOrderByCreatedAtDesc(User recipient);

    // 읽지 않은 알림 수 조회
    int countByRecipientAndIsReadFalse(User recipient);
}