package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Post;
import com.example.demo.repository.PostRepository;



@Service
public class RecommendationService {

    @Autowired
    private PostRepository postRepository;

    public List<Post> recommendPosts() {
       
        // 좋아요 수가 많은 상위 10개 게시글 반환
        return postRepository.findTop10ByOrderByLikesDesc();
    }
}
