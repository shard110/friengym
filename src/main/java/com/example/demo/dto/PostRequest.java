package com.example.demo.dto;

import com.example.demo.entity.Post;
import com.example.demo.entity.User;

public class PostRequest {
    private String poTitle; // Post 엔티티의 poTitle과 매칭
    private String poContents;  // Post 엔티티의 poContents와 매칭
    
    // Getters and Setters
    public String getPoTitle() {
        return poTitle;
    }

    public void setPoTitle(String poTitle) {
        this.poTitle = poTitle;
    }

    public String getPoContents() {
        return poContents;
    }

    public void setPoContents(String poContents) {
        this.poContents = poContents;
    }

    public Post toPost(User user) {
        Post post = new Post();
        post.setPoTitle(this.poTitle);
        post.setPoContents(this.poContents);
        post.setUser(user);
        return post;
    }
}