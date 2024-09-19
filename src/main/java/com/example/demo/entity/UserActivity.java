package com.example.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

public class UserActivity {

  @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Post post;

    private LocalDateTime viewedAt;

    public UserActivity(User user, Post post) {
        this.user = user;
        this.post = post;
        this.viewedAt = LocalDateTime.now();
    }

    public Post getPost() {
      return post;
    }
}
