package com.example.demo.message;

import java.util.List;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PubChatRoomService {

    private final PubChatRoomRepository pubChatRoomRepository;

    // 공개 채팅방 생성
    public PubChatRoomService createChatRoom(String title) {
        PubChatRoom room = new PubChatRoom();
        room.setTitle(title);
        return pubChatRoomRepository.save(room);
    }

    // 모든 공개 채팅방 조회
    public List<PubChatRoom> getAllChatRooms() {
        return pubChatRoomRepository.findAll();
    }
}
