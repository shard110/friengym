package com.example.demo.message;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Comparator;

import org.springframework.stereotype.Service;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
	
	private final ChatMessageRepository repository;	// 채팅 메시지를 저장하고 조회할 리포지토리
	private final ChatRoomService chatRoomService;	 // 채팅방 관리 서비스
	
	//메세지 저장하기
	public ChatMessage save(ChatMessage chatMessage) {
		// 송신자와 수신자 ID로 채팅방 ID를 가져옴. 없으면 예외 발생
		var chatId = chatRoomService.getChatRoomId(
				chatMessage.getSenderId(),
				chatMessage.getRecipientId(),
				true
		).orElseThrow(); // *
		
		 // 채팅 메시지에 채팅방 ID 설정
		chatMessage.setChatId(chatId);
		
		// ID와 타임스탬프 설정
		chatMessage.generateId(); // ID 생성
		chatMessage.setTimestamp(new Date()); // 타임스탬프 설정(추가)
		
		// 메시지를 리포지토리에 저장
		repository.save(chatMessage);
		return chatMessage; // 저장된 메시지 반환
	}
	
	// 특정 송신자와 수신자의 메시지 조회
	public List<ChatMessage> findChatMessages(String senderId, String recipientId) {
		// 채팅방 ID를 조회
		var chatId = chatRoomService.getChatRoomId(senderId, recipientId, false);
		// 채팅방 ID가 존재하면 해당 ID로 메시지 조회, 없으면 빈 리스트 반환
		return chatId.map(repository::findByChatId)
					  .orElse(new ArrayList<>())
					  .stream()	 // 리스트를 스트림으로 변환
					  .sorted(Comparator.comparing(ChatMessage::getTimestamp)) // 타임스탬프 기준 정렬
					  .toList(); // 정렬된 요소를 리스트로 변환하여 반환
	}

}
