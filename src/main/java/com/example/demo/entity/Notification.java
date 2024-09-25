package com.example.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@Entity
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 알림을 받는 사용자
    @ManyToOne
    @JoinColumn(name = "recipient_id")
    private User recipient;

    // 알림을 발생시킨 사용자
    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;

    // 알림 종류 (LIKE, COMMENT 등)
    @Enumerated(EnumType.STRING)
    private NotificationType type;

    // 관련된 게시물
    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    // 알림 생성 시간
    private LocalDateTime createdAt;

    // 읽음 여부
    private boolean isRead;

    // 기본 생성자
    public Notification() {
        this.createdAt = LocalDateTime.now();
        this.isRead = false;
    }


    // NotificationType 열거형 정의
    public enum NotificationType {
        LIKE,
        COMMENT
    }
}