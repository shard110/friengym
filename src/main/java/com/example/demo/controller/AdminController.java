package com.example.demo.controller;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Collections; // 추가된 import

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private static final String SECRET_KEY = "fdoF4tBudvJFrLuT0w28Xc0xRPv4eu5xWzrz5goiVQs="; // 비밀 키

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
                    .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                    .compact();

            // HashMap을 사용하여 응답 생성
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("token", token);

            return ResponseEntity.ok(response);
        } else {
            // 실패 응답
            return ResponseEntity.ok(Collections.singletonMap("success", false));
        }
    }
}
