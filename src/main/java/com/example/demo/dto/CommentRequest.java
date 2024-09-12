package com.example.demo.dto;

import com.example.demo.entity.Comment;
import com.example.demo.entity.Post;
import com.example.demo.entity.User;

public class CommentRequest {

    private String comment; // 댓글내용

    // 댓글 내용을 가져오는 getter 메서드
    public String getComment() {
        return comment;
    }

    // 댓글 내용을 설정하는 setter 메서드
    public void setComment(String comment) {
        this.comment = comment;
    }

    /* Dto -> Entity */
    public Comment toEntity(User user, Post post) {
        return Comment.builder()
                .comment(this.comment)
                .user(user)
                .post(post)
                .build();
    }
}