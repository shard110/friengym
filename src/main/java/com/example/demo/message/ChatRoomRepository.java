package com.example.demo.message;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, String> {

	//주어진 사용자가 발신자 또는 수신자 중 하나로 등장하는 모든 채팅방을 반환;;
	    // 발신자 또는 수신자 중 하나로 존재하는 채팅방을 찾는 메서드
		List<ChatRoom> findBySenderIdOrRecipientId(String senderId, String recipientId);
	
	//(한 쌍의 사용자만 찾는 기능)
	Optional<ChatRoom> findBySenderIdAndRecipientId(String senderId, String recipientId);
}