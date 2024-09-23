package com.example.demo.controller;

import com.example.demo.entity.Ask; // Ask 엔티티 임포트
import com.example.demo.repository.AskRepository; // AskRepository 임포트
import com.example.demo.entity.User; // User 엔티티 임포트
import com.example.demo.repository.UserRepository; // UserRepository 임포트
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

            // HashMap을 사용하여 응답 생성
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("token", token);

            return ResponseEntity.ok(response);
        } else {
            // 실패 응답
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Invalid credentials"); // 오류 메시지 추가
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    // 사용자 목록
    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {
        try {
            List<User> users = userRepository.findAll(); // UserRepository를 사용하여 모든 사용자 가져오기
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            // 로그에 오류 기록
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 사용자 삭제
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable String id) {
        try {
            userRepository.deleteById(id); // 여기서 오류 발생
            return ResponseEntity.ok("User deleted successfully.");
        } catch (Exception e) {
            e.printStackTrace(); // 오류 내용 확인
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting user.");
        }
    }

    // 모든 문의글 조회
    @GetMapping("/asks")
    public ResponseEntity<List<Ask>> getAsks() {
        try {
            List<Ask> asks = askRepository.findAll(); // 모든 문의글 가져오기
            System.out.println("Retrieved asks: " + asks);
            return ResponseEntity.ok(asks);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 특정 문의글 조회
    @GetMapping("/asks/{id}")
    public ResponseEntity<Ask> getAskById(@PathVariable int id) {
        try {
            Ask ask = askRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("문의글을 찾을 수 없습니다."));
            return ResponseEntity.ok(ask);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
}
