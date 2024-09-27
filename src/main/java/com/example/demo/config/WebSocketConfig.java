package com.example.demo.config;

import java.util.List;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.converter.DefaultContentTypeResolver;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.converter.MessageConverter;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import static org.springframework.util.MimeTypeUtils.APPLICATION_JSON;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import com.fasterxml.jackson.databind.ObjectMapper;

@Configuration
@EnableWebSocketMessageBroker	// WebSocket 메시지 브로커 기능 활성화
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer{

	
	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		 // 메시지 브로커 설정
		registry.enableSimpleBroker("/user");	// Simple Broker 활성화
		registry.setApplicationDestinationPrefixes("/app");	// 애플리케이션 목적지 프리픽스 설정
		registry.setUserDestinationPrefix(("/user"));	 // 사용자 목적지 프리픽스 설정
	}

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		// STOMP 엔드포인트 등록
		registry.addEndpoint("/ws")	 // "/ws" 엔드포인트 추가
				.setAllowedOrigins("http://localhost:3000") // CORS 허용
				.withSockJS();	 // SockJS 지원 추가
	}

	@Override
	public boolean configureMessageConverters(List<MessageConverter> messageConverters) {
		// 메시지 변환기 설정
		DefaultContentTypeResolver resolver = new DefaultContentTypeResolver();
	    resolver.setDefaultMimeType(APPLICATION_JSON);	 // 기본 MIME 타입을 JSON으로 설정
		MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter();	
	    converter.setObjectMapper(new ObjectMapper());	// Jackson ObjectMapper 설정
	    
	    messageConverters.add(converter); // 변환기를 메시지 변환기 목록에 추가

	    return false; // 기본 변환기 사용
	}
	
}