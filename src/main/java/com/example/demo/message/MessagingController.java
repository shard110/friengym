package com.example.demo.message;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.demo.entity.User;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class MessagingController {

    private final UserStatusService userStatusService; // 사용자 관리 서비스
    private final ChatMessageService chatMessageService; // 채팅 메시지 처리 서비스
    private final PubChatService pubChatService; // 공개 채팅 서비스
    private final SimpMessagingTemplate messagingTemplate; // WebSocket 메시지 전송 템플릿

    // WebSocket 메시지를 처리하여 사용자를 추가하는 메서드
    @MessageMapping("/user.addUser")
    @SendTo("/user/public")
    public User addUser(@Payload User user) {
        userStatusService.saveUser(user);
        return user;
    }

    // WebSocket 메시지를 처리하여 사용자를 연결 해제하는 메서드
    @MessageMapping("/user.disconnectUser")
    @SendTo("/user/public")
    public User disconnect(@Payload User user) {
        userStatusService.disconnect(user);
        return user;
    }

    // HTTP GET 요청을 처리하여 연결된 사용자 목록을 반환하는 메서드
    @GetMapping("/users")
    public ResponseEntity<List<User>> findConnectedUsers() {
        return ResponseEntity.ok(userStatusService.findConnectedUsers());
    }

    // 채팅 메시지를 처리하는 메서드
    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {
        ChatMessage saveMsg = chatMessageService.save(chatMessage);
        ChatNotification notification = new ChatNotification(
                saveMsg.getId(),
                saveMsg.getSenderId(),
                saveMsg.getRecipientId(),
                saveMsg.getContent());

        messagingTemplate.convertAndSendToUser(
                chatMessage.getRecipientId(),
                "/queue/messages",
                notification);
    }

    // 특정 송신자와 수신자의 메시지 조회
    @GetMapping("/messages/{senderId}/{recipientId}")
    public ResponseEntity<List<ChatMessage>> findChatMessages(
            @PathVariable("senderId") String senderId,
            @PathVariable("recipientId") String recipientId) {
        return ResponseEntity.ok(chatMessageService.findChatMessages(senderId, recipientId));
    }

    // 공개 채팅방에 메시지를 전송하는 메서드
    @MessageMapping("/pubChat.sendMessage")
    @SendTo("/topic/public/{topic}") // 주제에 따라 다르게 전송
    public PubChatMessage sendPublicMessage(@Payload PubChatMessage pubChatMessage) {
        // 메세지를 저장
        PubChatMessage savedMessage = pubChatMessageService.save(pubChatMessage);
        return savedMessage;
    }

    // 공개 채팅방 생성 메서드
    @PostMapping("/pubChat/rooms")
    public ResponseEntity<PubChatRoom> createChatRoom(@RequestBody PubChatRoom chatRoom) {
        PubChatRoom createdRoom = pubChatService.createChatRoom(chatRoom);
        return ResponseEntity.ok(createdRoom);
    }

    // 공개 채팅방 목록 조회
    @GetMapping("/publicChatRooms")
    public ResponseEntity<List<PublicChatRoom>> getPublicChatRooms() {
        return ResponseEntity.ok(publicChatRoomService.getAllChatRooms());
    }
}
