package com.example.demo.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.config.JwtTokenProvider;
import com.example.demo.dto.FollowResponse;
import com.example.demo.entity.Follow;
import com.example.demo.entity.User;
import com.example.demo.service.FollowService;
import com.example.demo.service.UserService;

@RestController
@RequestMapping("/follow")
@CrossOrigin(origins = "http://localhost:3000")
public class FollowController {

    @Autowired
    private FollowService followService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // 팔로잉 목록 조회
    @GetMapping("/following")
    public ResponseEntity<?> getFollowingList(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String userId = jwtTokenProvider.getClaims(token).getSubject();
        Optional<User> userOpt = userService.findById(userId);
       if (userOpt.isPresent()) {
        List<Follow> following = followService.getFollowing(userOpt.get());
        List<FollowResponse> followingResponses = following.stream()
            .map(FollowResponse::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(followingResponses);
    } else {
        return ResponseEntity.status(404).body("User not found");
    }
    }

    // 팔로워 목록 조회
    @GetMapping("/followers")
    public ResponseEntity<?> getFollowersList(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String userId = jwtTokenProvider.getClaims(token).getSubject();
        Optional<User> userOpt = userService.findById(userId);
        
        if (userOpt.isPresent()) {
            List<Follow> followers = followService.getFollowers(userOpt.get());
            List<FollowResponse> followerResponses = followers.stream()
                .map(FollowResponse::new)
                .collect(Collectors.toList());
            return ResponseEntity.ok(followerResponses);
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }
    // 팔로우 하기
    @PostMapping("/follow/{followingId}")
    public ResponseEntity<?> followUser(@RequestHeader("Authorization") String authHeader, @PathVariable String followingId) {
        String token = authHeader.replace("Bearer ", "");
        String userId = jwtTokenProvider.getClaims(token).getSubject();
        Optional<User> followerOpt = userService.findById(userId);
        Optional<User> followingOpt = userService.findById(followingId);

        if (followerOpt.isPresent() && followingOpt.isPresent()) {
            User follower = followerOpt.get();
            User following = followingOpt.get();

            Optional<Follow> existingFollow = followService.findFollow(follower, following);
            if (existingFollow.isPresent()) {
                return ResponseEntity.badRequest().body("Already following");
            }

            Follow follow = new Follow();
            follow.setFollower(follower);
            follow.setFollowing(following);
            followService.saveFollow(follow);
            return ResponseEntity.ok("Followed successfully");
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }

    // 언팔로우 하기
    @DeleteMapping("/unfollow/{followingId}")
    public ResponseEntity<?> unfollowUser(@RequestHeader("Authorization") String authHeader, @PathVariable String followingId) {
        String token = authHeader.replace("Bearer ", "");
        String userId = jwtTokenProvider.getClaims(token).getSubject();
        Optional<User> followerOpt = userService.findById(userId);
        Optional<User> followingOpt = userService.findById(followingId);

        if (followerOpt.isPresent() && followingOpt.isPresent()) {
            User follower = followerOpt.get();
            User following = followingOpt.get();

            Optional<Follow> followOpt = followService.findFollow(follower, following);
            if (followOpt.isPresent()) {
                followService.deleteFollow(followOpt.get());
                return ResponseEntity.ok("Unfollowed successfully");
            } else {
                return ResponseEntity.badRequest().body("Not following this user");
            }
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }

    @GetMapping("/is-following-me/{otherUserId}")
    public ResponseEntity<Boolean> isFollowingMe(
        @RequestHeader("Authorization") String authHeader,
        @PathVariable String otherUserId
    ) {
        String token = authHeader.replace("Bearer ", "");
        String currentUserId = jwtTokenProvider.getClaims(token).getSubject();

        boolean isFollowing = followService.isFollowingMe(otherUserId, currentUserId);
        return ResponseEntity.ok(isFollowing);
    }
}
