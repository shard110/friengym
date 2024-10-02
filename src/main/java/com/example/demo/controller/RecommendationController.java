package com.example.demo.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.CommentResponse;
import com.example.demo.dto.PostResponse;
import com.example.demo.entity.Post;
import com.example.demo.service.CommentService;
import com.example.demo.service.RecommendationService;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:3000")
public class RecommendationController {

    private static final Logger logger = LoggerFactory.getLogger(RecommendationController.class);

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private CommentService commentService;

    // 사용자 맞춤 추천
    @GetMapping
    public ResponseEntity<?> recommendPosts() {
        try {
            List<Post> recommendedPosts = recommendationService.recommendPosts();

            List<PostResponse> response = recommendedPosts.stream()
                    .map(post -> {
                        List<CommentResponse> comments = commentService.getTopLevelComments(post.getPoNum());
                        return new PostResponse(post, comments);
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // 예외 처리
            logger.error("추천 게시글 조회 실패: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }
}