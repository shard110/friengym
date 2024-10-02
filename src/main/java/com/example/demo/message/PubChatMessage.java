package com.example.demo.message;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
@Entity
public class PubChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String senderId;
    private String content;
    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private PubChatRoom chatRoom; // 어떤 채팅방에 속하는지
}