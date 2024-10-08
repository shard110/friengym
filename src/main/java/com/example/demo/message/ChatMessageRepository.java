package com.example.demo.message;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, String> {
    // 주어진 채팅방 ID에 해당하는 메시지 목록을 반환하는 메서드
	List<ChatMessage> findByChatId(String s);
}