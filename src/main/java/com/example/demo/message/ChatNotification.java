package com.example.demo.message;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class ChatNotification {
	private String id; //
	private String senderId;
	private String recipientId;
	private String content;

}