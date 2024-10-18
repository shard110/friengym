package com.example.demo.message;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream; // Stream import 추가

import org.springframework.stereotype.Service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.message.ChatRoom;
import com.example.demo.message.ChatUserResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class ChatRoomService {

	private final ChatRoomRepository chatRoomRepository;
	private final UserRepository userRepository; // User 정보를 가져오기 위한 레포지토리

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

	public List<ChatUserResponse> getUsersInChat(String userId) {
		try {
			// 사용자 ID로 대화 중인 채팅방 목록 가져오기
			List<ChatRoom> chatRooms = chatRoomRepository.findBySenderIdOrRecipientId(userId, userId);
	
			// 사용자 목록 생성
			return chatRooms.stream()
				.flatMap(room -> {
					String otherUserId = room.getSenderId().equals(userId) ? room.getRecipientId() : room.getSenderId();
					return userRepository.findById(otherUserId)
						.map(user -> new ChatUserResponse(
								user.getId(),
								user.getName(),
								user.getPhoto(),
								user.getStatus() != null ? user.getStatus().name() : "UNKNOWN" // 상태가 null일 경우 "UNKNOWN" 반환
						))
						.map(Stream::of)
						.orElseGet(Stream::empty); // 사용자 정보가 없을 경우 빈 Stream 반환
				})
				.collect(Collectors.toList());
		} catch (Exception e) {
			// 예외 발생 시 로그 기록 및 적절한 메시지 반환
			e.printStackTrace();
			throw new RuntimeException("Error fetching users in chat: " + e.getMessage());
		}
	}
}