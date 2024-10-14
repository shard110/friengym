package com.example.demo.controller;

import com.example.demo.entity.Ask;
import com.example.demo.entity.User;
import com.example.demo.dto.AskDTO; // AskDTO 임포트
import com.example.demo.dto.UserDTO; // UserDTO 임포트
import com.example.demo.repository.AskRepository;
import com.example.demo.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Value("${jwt.secret}") // application.properties에서 비밀 키 가져오기
    private String secretKey;

    private final UserRepository userRepository;
    private final AskRepository askRepository;

    @Autowired
    public AdminController(UserRepository userRepository, AskRepository askRepository) {
        this.userRepository = userRepository;
        this.askRepository = askRepository;
    }

    // 관리자 로그인
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> payload) {
        String aid = payload.get("aid");
        String apwd = payload.get("apwd");

        if ("admin".equals(aid) && "admin".equals(apwd)) {
            // JWT 생성
            String token = Jwts.builder()
                    .setSubject(aid)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1일 후 만료
                    .signWith(SignatureAlgorithm.HS256, secretKey) // 비밀 키 사용
                    .compact();

            // 응답 생성
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("token", token);
            return ResponseEntity.ok(response);
        } else {
            // 실패 응답
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "Invalid credentials"));
        }
    }

    // 사용자 목록
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getUsers() {
        try {
            List<User> users = userRepository.findAll();
            List<UserDTO> userDTOs = users.stream()
                .map(user -> new UserDTO(
                    user.getId(),
                    user.getName(),
                    user.getPhone(),
                    user.getEmail(),
                    user.getSex(),
                    user.getBirth(),
                    user.getFirstday(),
                    user.getRestday()
                ))
                .collect(Collectors.toList());

            return ResponseEntity.ok(userDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 사용자 삭제
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable String id) {
        try {
            userRepository.deleteById(id);
            return ResponseEntity.ok("User deleted successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting user.");
        }
    }

    // 모든 문의글 조회
    @GetMapping("/asks")
    public ResponseEntity<List<AskDTO>> getAsks() {
        try {
            List<Ask> asks = askRepository.findAll();
            List<AskDTO> askDTOs = asks.stream()
                .map(ask -> new AskDTO(
                    ask.getAnum(),
                    ask.getADate(),
                    ask.getATitle(),
                    ask.getAContents(),
                    (ask.getUser() != null) ? ask.getUser().getId() : "정보 없음", // User ID를 가져옴
                    ask.getReply() // reply 필드 추가
                ))
                .collect(Collectors.toList());

            return ResponseEntity.ok(askDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 특정 문의글 조회
    @GetMapping("/asks/{id}")
    public ResponseEntity<AskDTO> getAskById(@PathVariable int id) {
        try {
            Ask ask = askRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("문의글을 찾을 수 없습니다."));
            
            // AskDTO로 변환하여 사용자 ID 포함
            AskDTO askDTO = new AskDTO(
                ask.getAnum(),
                ask.getADate(),
                ask.getATitle(),
                ask.getAContents(),
                (ask.getUser() != null) ? ask.getUser().getId() : "정보 없음", // User ID를 가져옴
                ask.getReply() // reply 필드 추가
            );
            
            return ResponseEntity.ok(askDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 문의글 답글 달기
    @PostMapping("/asks/{id}/reply")
    public ResponseEntity<String> replyToAsk(@PathVariable int id, @RequestBody String reply) {
        try {
            Ask ask = askRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("문의글이 존재하지 않습니다."));
            
            // 문자열로 reply를 처리
            reply = reply.replace("\"", ""); // JSON 형식에서 따옴표 제거 (필요시)
            
            ask.setReply(reply);
            askRepository.save(ask);
            return ResponseEntity.ok("답변이 등록되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("답변 등록에 실패했습니다.");
        }
    }

    // 문의글 답글 삭제
    @DeleteMapping("/asks/{id}/reply")
    public ResponseEntity<String> deleteReply(@PathVariable int id) {
        try {
            Ask ask = askRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("문의글이 존재하지 않습니다."));
            ask.setReply(null);
            askRepository.save(ask);
            return ResponseEntity.ok("답변이 삭제되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("답변 삭제에 실패했습니다.");
        }
    }

    // 유저 개월 수 선택
    @PatchMapping("/users/{id}/addMonths")
    public ResponseEntity<String> addMonths(@PathVariable String id, @RequestBody Map<String, Integer> payload) {
        int months = payload.get("months");
        int daysToAdd = switch (months) {
            case 1 -> 30;
            case 3 -> 90;
            case 6 -> 180;
            case 12 -> 360;
            default -> -1;
        };

        if (daysToAdd == -1) {
            return ResponseEntity.badRequest().body("Invalid month value.");
        }

        try {
            User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getFirstday() == null) {
                user.setFirstday(java.sql.Date.valueOf(LocalDate.now()));
            }

            int newRestday = (user.getRestday() != null ? user.getRestday() : 0) + daysToAdd;
            user.setRestday(newRestday);
            userRepository.save(user);
            return ResponseEntity.ok("개월 수가 성공적으로 추가되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding months.");
        }
    }
}
