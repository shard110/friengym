package com.example.demo.dto;

import java.util.List;

import com.example.demo.entity.Post;
import com.example.demo.entity.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostRequest {

    private String poContents;  // Post 엔티티의 poContents와 매칭
    private List<String> hashtags;


    public Post toPost(User user) {
        Post post = new Post();
        post.setPoContents(this.poContents);
        post.setUser(user);
        return post;
    }
}