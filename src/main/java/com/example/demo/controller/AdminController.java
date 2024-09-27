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
import java.time.LocalDate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
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

    // 문의글 답글 달기
    @PostMapping("/asks/{id}/reply")
    public ResponseEntity<String> replyToAsk(@PathVariable int id, @RequestBody String reply) {
        try {
            Ask ask = askRepository.findById(id).orElseThrow(() -> new RuntimeException("문의글이 존재하지 않습니다."));
            ask.setReply(reply); // 엔티티의 reply 필드에 값 설정
            askRepository.save(ask); // 업데이트
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
            Ask ask = askRepository.findById(id).orElseThrow(() -> new RuntimeException("문의글이 존재하지 않습니다."));
            ask.setReply(null); // 답변을 삭제하기 위해 reply 필드를 null로 설정
            askRepository.save(ask); // 업데이트
            return ResponseEntity.ok("답변이 삭제되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("답변 삭제에 실패했습니다.");
        }
    }

    private Map<String, Integer> userRestdayMap = new HashMap<>(); // 사용자의 남은 일수를 저장하는 맵

    // 유저 개월 수 선택
    @PatchMapping("/users/{id}/addMonths")
    public ResponseEntity<String> addMonths(@PathVariable String id, @RequestBody Map<String, Integer> payload) {
        int months = payload.get("months");
        int daysToAdd = 0;

        switch (months) {
            case 1:
                daysToAdd = 30;
                break;
            case 3:
                daysToAdd = 90;
                break;
            case 6:
                daysToAdd = 180;
                break;
            case 12:
                daysToAdd = 360;
                break;
            default:
                return ResponseEntity.badRequest().body("Invalid month value.");
        }

        try {
            User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

            // firstday가 null인 경우에만 현재 날짜로 설정
            if (user.getFirstday() == null) {
                LocalDate currentDate = LocalDate.now();
                user.setFirstday(java.sql.Date.valueOf(currentDate)); // firstday에 현재 날짜 저장
            }

            // 기존 남은 일수에 추가된 일수 더하기
            int newRestday = (user.getRestday() != null ? user.getRestday() : 0) + daysToAdd;
            user.setRestday(newRestday); // 업데이트된 남은 일수 설정

            // 사용자의 남은 일수를 userRestdayMap에 추가
            userRestdayMap.put(id, newRestday);

            userRepository.save(user);
            return ResponseEntity.ok("개월 수가 성공적으로 추가되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding months.");
        }
    }

    // 남은 일수 10초마다 1씩 빼기
    @Scheduled(fixedRate = 10000) // 10초마다 실행
    public void decreaseRestdays() {
        for (String userId : userRestdayMap.keySet()) {
            int currentRestday = userRestdayMap.get(userId);
            if (currentRestday > 0) {
                userRestdayMap.put(userId, currentRestday - 1); // 10초마다 남은 일수 감소
                // 데이터베이스 업데이트
                User user = userRepository.findById(userId).orElse(null);
                if (user != null) {
                    user.setRestday(currentRestday - 1);
                    userRepository.save(user);
                }
            }
        }
    }

}
