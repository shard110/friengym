package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Post;
import com.example.demo.entity.User;
import com.example.demo.entity.UserActivity;
import com.example.demo.exception.PostNotFoundException;
import com.example.demo.repository.PostRepository;
import com.example.demo.repository.UserActivityRepository;

@Service
public class UserActivityService {

   @Autowired
    private UserActivityRepository userActivityRepository;

    @Autowired
    private PostRepository postRepository;

    public void logUserActivity(User user, Integer poNum) {
        Post post = postRepository.findById(poNum)
                .orElseThrow(() -> new PostNotFoundException(poNum));
        UserActivity activity = new UserActivity(user, post);
        userActivityRepository.save(activity);
    }
    
}