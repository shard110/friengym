package com.example.demo.service;

import java.sql.Timestamp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.AskDTO;
import com.example.demo.entity.Ask;
import com.example.demo.repository.AskRepository;

@Service
@Transactional  // 서비스 계층에서 트랜잭션 관리
public class AskService {

    @Autowired
    private AskRepository askRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // PasswordEncoder 주입

    // 엔터티를 DTO로 변환하는 메소드
    private AskDTO convertToDto(Ask ask) {
        return new AskDTO(
            ask.getAnum(),
            ask.getATitle(),
            ask.getAContents(),
            ask.getAfile(),
            ask.getADate(),
            ask.getUser().getId(),  // User의 id만 가져옴
            ask.getPasswordHash(),
            ask.getReply()
        );
    }

    // 모든 문의글 조회 (페이징 처리)
    public Page<AskDTO> getAllAsks(int page, int size) {
        // aDate를 기준으로 내림차순 정렬
    Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "aDate"));
        Page<Ask> asks = askRepository.findAll(pageable);
        return asks.map(this::convertToDto);  // 엔터티를 DTO로 변환
    }

    // 특정 문의글 조회 및 비밀번호 확인
    public AskDTO getAskByIdAndPassword(int anum, String rawPassword) {
        Ask ask = askRepository.findById(anum)
                .orElseThrow(() -> new IllegalArgumentException("문의글을 찾을 수 없습니다."));
      
        if (rawPassword != null && passwordEncoder.matches(rawPassword, ask.getPasswordHash())) {
            return convertToDto(ask);  // DTO로 반환
        } else {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }
    }

    // 새로운 문의글 생성
    public AskDTO createAsk(Ask ask, String rawPassword) {
        String hashedPassword = passwordEncoder.encode(rawPassword);
        ask.setPasswordHash(hashedPassword);
        Ask savedAsk = askRepository.save(ask);
        return convertToDto(savedAsk);  // DTO로 반환
    }

    // 문의글 수정
    public AskDTO updateAsk(int anum, AskDTO ask) {
        Ask existingAsk = askRepository.findById(anum)
        .orElseThrow(() -> new IllegalArgumentException("해당 문의글을 찾을 수 없습니다."));

        // 기존 정보 수정
        existingAsk.setATitle(ask.getATitle());
        existingAsk.setAContents(ask.getAContents());
        existingAsk.setAfile(ask.getAfile());

        // 수정한 날짜로 작성일 업데이트
        existingAsk.setADate(new Timestamp(System.currentTimeMillis()));

        // 수정됨 상태로 변경
        existingAsk.setUpdated(true);

        Ask savedAsk = askRepository.save(existingAsk);
        return convertToDto(savedAsk);  // DTO로 반환
    }

    // 문의글 삭제
    public void deleteAsk(int anum) {
        Ask ask = askRepository.findById(anum)
        .orElseThrow(() -> new IllegalArgumentException("해당 문의글을 찾을 수 없습니다."));
    
        askRepository.delete(ask);
    }

    // 특정 작성자의 모든 문의글을 페이징 처리하여 조회
    public Page<AskDTO> getAsksByUserId(String id, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Ask> asks = askRepository.findByUserId(id, pageable);
        return asks.map(this::convertToDto);  // 엔터티를 DTO로 변환
    }

    // 특정 문의글 조회
    public AskDTO getAskById(int anum) {
        Ask ask = askRepository.findById(anum)
                .orElseThrow(() -> new RuntimeException("해당 게시글을 찾을 수 없습니다."));
        return convertToDto(ask);  // DTO로 반환
    }


}
