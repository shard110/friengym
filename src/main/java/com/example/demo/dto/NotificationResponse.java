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
    private String type;

    public NotificationResponse(Notification notification) {
        this.id = notification.getId();
        this.senderId = notification.getSender().getId();
        this.postId = notification.getPost().getPoNum();
        this.createdAt = notification.getCreatedAt();
        this.isRead = notification.isRead();
        this.type = notification.getType().toString();

        // 메시지 생성: 알림 타입에 따라 메시지 다르게 설정
        switch (notification.getType()) {
            case FOLLOW:
                this.message = senderId + "님이 당신을 팔로우했습니다.";
                break;
            case LIKE:
                this.message = senderId + "님이 당신의 게시글에 좋아요를 눌렀습니다.";
                break;
            case COMMENT:
                this.message = senderId + "님이 당신의 게시글에 댓글을 남겼습니다.";
                break;
        }

}
}
