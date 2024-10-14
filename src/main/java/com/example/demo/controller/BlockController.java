package com.example.demo.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.config.JwtTokenProvider;
import com.example.demo.entity.User;
import com.example.demo.service.BlockService;
import com.example.demo.service.UserService;

@RestController
@RequestMapping("/api/block")  // API 경로 명시
public class BlockController {

    @Autowired
    private BlockService blockService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // 유저 차단하기
    @PostMapping("/{blockedId}")
    public ResponseEntity<?> blockUser(
        @RequestHeader("Authorization") String authHeader, @PathVariable String blockedId) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String blockerId = jwtTokenProvider.getClaims(token).getSubject();

            User blocker = userService.findById(blockerId)
                .orElseThrow(() -> new IllegalArgumentException("Blocker not found"));
            User blocked = userService.findById(blockedId)
                .orElseThrow(() -> new IllegalArgumentException("Blocked user not found"));

            blockService.blockUser(blocker, blocked);
            return ResponseEntity.ok("User blocked and unfollowed successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();  // 예외를 서버 로그에 출력
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }

    // 차단 해제
    @DeleteMapping("/{blockedId}")
    public ResponseEntity<?> unblockUser(@RequestHeader("Authorization") String authHeader, @PathVariable String blockedId) {
        String token = authHeader.replace("Bearer ", "");
        String blockerId = jwtTokenProvider.getClaims(token).getSubject();
        Optional<User> blockerOpt = userService.findById(blockerId);
        Optional<User> blockedOpt = userService.findById(blockedId);

        if (blockerOpt.isPresent() && blockedOpt.isPresent()) {
            blockService.unblockUser(blockerOpt.get(), blockedOpt.get());
            return ResponseEntity.ok("User unblocked successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }
}
