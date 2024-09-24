package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Post;
import com.example.demo.entity.User;
import com.example.demo.exception.InvalidTokenException;
import com.example.demo.exception.UserNotFoundException;
import com.example.demo.service.RecommendationService;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:3000")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    // 사용자 맞춤 추천
    @GetMapping
    public ResponseEntity<?> recommendPosts(@RequestHeader("Authorization") String authHeader) {
        try {
            // JWT 토큰에서 사용자 ID 추출
            String userId = recommendationService.getUserIdFromToken(authHeader);
            User user = recommendationService.findUserById(userId);
            List<Post> recommendedPosts = recommendationService.recommendPosts(user);
            return ResponseEntity.ok(recommendedPosts);
        } catch (UserNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    } catch (InvalidTokenException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
    }
}
}
