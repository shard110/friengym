package com.example.demo.dto;

import com.example.demo.entity.Comment;
import com.example.demo.entity.Post;
import com.example.demo.entity.User;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CommentRequest {

    private String comment; // 댓글내용
    private Integer parentId; // 부모 댓글 ID (답글인 경우)

    /* Dto -> Entity */
    public Comment toEntity(User user, Post post, Comment parent) {
        Comment commentEntity = new Comment();
        commentEntity.setComment(this.comment);
        commentEntity.setUser(user);
        commentEntity.setPost(post);
        commentEntity.setParent(parent);
        return commentEntity;
    }
}
