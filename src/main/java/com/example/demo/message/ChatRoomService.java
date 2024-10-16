package com.example.demo.message;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class ChatRoomService {

	private final ChatRoomRepository chatRoomRepository;
	 private final UserRepository userRepository; // 사용자 정보를 가져오기 위한 리포지토리 추가

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

	    // 특정 사용자가 대화 중인 사용자 목록 가져오기
		public List<String> getUsersInChat(String userId) {
			// 사용자가 발신자나 수신자인 모든 채팅방을 찾음
			List<ChatRoom> chatRooms = chatRoomRepository.findBySenderIdOrRecipientId(userId, userId);
	
			// 대화 중인 상대방 목록을 추출
			return chatRooms.stream()
					.map(chatRoom -> chatRoom.getSenderId().equals(userId) ? chatRoom.getRecipientId() : chatRoom.getSenderId())
					.distinct() // 중복 사용자 제거
					.collect(Collectors.toList());
		}

	    // 대화 중인 사용자 ID 목록을 받아 이름 목록을 반환하는 메서드
		public List<String> getUserNamesInChat(String userId) {
			List<String> userIdsInChat = getUsersInChat(userId); // 대화 중인 사용자 ID 목록 가져오기
			List<User> users = userRepository.findAllById(userIdsInChat); // 사용자 ID로 사용자 목록 가져오기
			return users.stream().map(User::getName).collect(Collectors.toList()); // 이름 목록으로 변환
		}
}