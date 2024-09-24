package com.example.demo.service;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Hashtag;
import com.example.demo.entity.Post;
import com.example.demo.entity.User;
import com.example.demo.entity.UserActivity;
import com.example.demo.exception.InvalidTokenException;
import com.example.demo.exception.UserNotFoundException;
import com.example.demo.repository.PostRepository;
import com.example.demo.repository.UserActivityRepository;
import com.example.demo.repository.UserRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
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
    if (token == null || !token.startsWith("Bearer ")) {
        throw new InvalidTokenException("Missing or invalid Authorization header");
    }
    try {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secretKey.getBytes(StandardCharsets.UTF_8))
                .build()
                .parseClaimsJws(token.replace("Bearer ", ""))
                .getBody();
        return claims.getSubject();
    } catch (JwtException | IllegalArgumentException e) {
        throw new InvalidTokenException("Invalid JWT token", e);
    }
}


     // 사용자 ID로 User 객체를 찾는 메서드
     public User findUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

    }


    // 추천 게시글 로직
    public List<Post> recommendPosts(User user) {
        List<UserActivity> activities = userActivityRepository.findByUser(user);
       Map<String, Long> hashtagFrequency = activities.stream()
                        .flatMap(activity -> activity.getPost().getHashtags().stream())
                        .map(Hashtag::getTag) // Hashtag 객체를 tag 문자열로 변환
                        .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

        List<String> topHashtags = hashtagFrequency.entrySet().stream()
            .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
            .limit(5)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());

            return postRepository.findByHashtagsIn(topHashtags).stream().distinct().collect(Collectors.toList());

    }
}
