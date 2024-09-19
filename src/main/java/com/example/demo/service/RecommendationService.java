package com.example.demo.service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Post;
import com.example.demo.entity.User;
import com.example.demo.entity.UserActivity;
import com.example.demo.repository.PostRepository;
import com.example.demo.repository.UserActivityRepository;
import com.example.demo.repository.UserRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;



@Service
public class RecommendationService {

    @Autowired
    private UserActivityRepository userActivityRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

     // JWT 시크릿 키 (application.properties에서 가져옴)
     @Value("${jwt.secret}")
     private String secretKey;


     // JWT 토큰에서 사용자 ID를 추출하는 메서드
    public String getUserIdFromToken(String token) {
        // JWT 토큰 파싱 및 사용자 ID 추출
        Claims claims = Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token.replace("Bearer ", ""))
                .getBody();
        return claims.getSubject(); // 사용자 ID 또는 username을 반환
    }

     // 사용자 ID로 User 객체를 찾는 메서드
     public User findUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }


    // 추천 게시글 로직
    public List<Post> recommendPosts(User user) {
        List<UserActivity> activities = userActivityRepository.findByUser(user);
        Map<String, Long> hashtagFrequency = activities.stream()
            .flatMap(activity -> activity.getPost().getHashtags().stream())
            .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

        List<String> topHashtags = hashtagFrequency.entrySet().stream()
            .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
            .limit(5)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());

        return postRepository.findByHashtagsIn(topHashtags);
    }
}
