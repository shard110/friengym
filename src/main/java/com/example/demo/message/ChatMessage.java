package com.example.demo.message;

import java.util.Date;
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
@Table(name= "chat_messages") //☆
public class ChatMessage {
	
	@Id
	private String id;	//☆식별자
	
	private String chatId;
	private String senderId;
	private String recipientId;
	private String content;
	private Date timestamp;
	
    // ID를 생성하는 메서드 추가
    public void generateId() {
        this.id = UUID.randomUUID().toString(); // 고유한 ID 생성
    }
}
