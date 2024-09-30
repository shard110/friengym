package com.example.demo.message;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class ChatRoomService {

	private final ChatRoomRepository chatRoomRepository;

	// 채팅방 ID 가져오기
	public Optional<String> getChatRoomId(

			String senderId, String recipientId, boolean createNewRoomIfNotExists) {
		return chatRoomRepository.findBySenderIdAndRecipientId(senderId, recipientId).map(ChatRoom::getChatId)
				.or(() -> {
					if (createNewRoomIfNotExists) {
						var chatId = createChatId(senderId, recipientId);
						return Optional.of(chatId);
					}
					return Optional.empty();
				});
	}

	// 새로운 채팅 ID 생성
	private String createChatId(String senderId, String recipientId) {
		var chatId = String.format("%s_%s", senderId, recipientId); // 발신자_수신자

		// 두 사용자 간의 채팅 방 생성
		ChatRoom senderRecipient = ChatRoom.builder().roomId(generateRoomId()) // ☆ 방 ID 생성 메서드 추가
				.chatId(chatId).senderId(senderId).recipientId(recipientId).build();

		ChatRoom recipientSender = ChatRoom.builder().roomId(generateRoomId()) // ☆방 ID 생성
				.chatId(chatId).senderId(recipientId).recipientId(senderId).build();

		// 데이터베이스에 저장
		chatRoomRepository.save(senderRecipient);
		chatRoomRepository.save(recipientSender);
		return chatId;
	}

	// 방 ID 생성 메서드
	private String generateRoomId() {
		return UUID.randomUUID().toString(); // ☆UUID를 사용한 방 ID 생성
	}
}