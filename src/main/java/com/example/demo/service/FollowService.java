package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Follow;
import com.example.demo.entity.User;
import com.example.demo.repository.FollowRepository;

@Service
public class FollowService {
    
    @Autowired
    private FollowRepository followRepository;
    
    public List<Follow> getFollowers(User user) {
        return followRepository.findByFollowing(user);
    }
    
    public List<Follow> getFollowing(User user) {
        return followRepository.findByFollower(user);
    }
    
    public Optional<Follow> findFollow(User follower, User following) {
        return followRepository.findByFollowerAndFollowing(follower, following);
    }
    
    public Follow saveFollow(Follow follow) {
        return followRepository.save(follow);
    }
    
    public void deleteFollow(Follow follow) {
        followRepository.delete(follow);
    }
    
    
}