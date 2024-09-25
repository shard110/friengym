// NotificationResponse.java

package com.example.demo.dto;

import java.time.LocalDateTime;

import com.example.demo.entity.Notification;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class NotificationResponse {

    private Long id;
    private String senderId;
    private String message;
    private Integer postId;
    private LocalDateTime createdAt;
    private boolean isRead;

    public NotificationResponse(Notification notification) {
        this.id = notification.getId();
        this.senderId = notification.getSender().getId();
        this.postId = notification.getPost().getPoNum();
        this.createdAt = notification.getCreatedAt();
        this.isRead = notification.isRead();

        if (notification.getType() == Notification.NotificationType.LIKE) {
            this.message = senderId + "님이 회원님의 게시물을 좋아합니다.";
        } else if (notification.getType() == Notification.NotificationType.COMMENT) {
            this.message = senderId + "님이 회원님의 게시물에 댓글을 남겼습니다.";
        } else {
            this.message = "새로운 알림이 있습니다.";
        }
    }

   
}
