package com.example.demo.message;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Data
@Entity
public class PubChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title; // 채팅방 이름 (주제)

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL)
    private List<PubChatMessage> messages; // 해당 방의 메시지 목록
}
