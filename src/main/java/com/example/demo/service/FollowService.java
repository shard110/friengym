package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.Follow;
import com.example.demo.entity.User;
import com.example.demo.repository.FollowRepository;

@Service
public class FollowService {
    
    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private NotificationService notificationService;

    
    public List<Follow> getFollowers(User user) {
        return followRepository.findByFollowing(user);
    }
    
    public List<Follow> getFollowing(User user) {
        return followRepository.findByFollower(user);
    }
    
    public Optional<Follow> findFollow(User follower, User following) {
        return followRepository.findByFollowerAndFollowing(follower, following);
    }
    
    @Transactional
    public Follow saveFollow(Follow follow) {
        Follow savedFollow = followRepository.save(follow);

        // 팔로우 성공 시 알림 생성
        notificationService.createFollowNotification(follow.getFollower(), follow.getFollowing());

        return savedFollow;
    }
    
    @Transactional
    public void deleteFollow(Follow follow) {
        followRepository.delete(follow);
    }

    public boolean isFollowingMe(String otherUserId, String currentUserId) {
        return followRepository.isFollowingMe(otherUserId, currentUserId);
    }
    
    
}