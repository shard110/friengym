package com.example.demo.message;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "chat_room") 
public class ChatRoom {
	@Id
	private String roomId;	//방 ID
	private String chatId;	//채팅 ID
	private String senderId;	//발신자 ID
	private String recipientId;	// 수신자 ID
	
	public void generateRoomId() {
	this.roomId = UUID.randomUUID().toString(); // UUID로 방 ID 생성
}
}
