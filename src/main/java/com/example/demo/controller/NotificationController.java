// NotificationController.java

package com.example.demo.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.NotificationResponse;
import com.example.demo.entity.Notification;
import com.example.demo.service.NotificationService;
import com.example.demo.service.PostService;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private PostService postService;

    // 알림 목록 가져오기
    @GetMapping
    public ResponseEntity<?> getNotifications(@RequestHeader("Authorization") String authHeader) {
        try {
            String userId = postService.getUserIdFromToken(authHeader);
            List<Notification> notifications = notificationService.getNotifications(userId);

            List<NotificationResponse> response = notifications.stream()
                    .map(NotificationResponse::new)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
    }

    // 알림 읽음 처리
    @PostMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        try {
            notificationService.markAsRead(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Notification not found");
        }
    }

    // 읽지 않은 알림 수 가져오기
    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(@RequestHeader("Authorization") String authHeader) {
        try {
            String userId = postService.getUserIdFromToken(authHeader);
            int count = notificationService.getUnreadCount(userId);
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
    }
}