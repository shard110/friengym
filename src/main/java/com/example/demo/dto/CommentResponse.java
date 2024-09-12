package com.example.demo.dto;

import com.example.demo.entity.Comment;
import lombok.Getter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
public class CommentResponse {

    private Integer commentNo;
    private String comment; //댓글내용
    private String createdDate; // LocalDateTime 대신 String으로 변경
    private String modifiedDate; // LocalDateTime 대신 String으로 변경
    private Integer poNum;
    private String name; // 작성자 이름
    private String id; // 댓글 작성자 ID (변경된 필드 이름)

    /* Entity -> Dto */
    public CommentResponse(Comment comment) {
        this.commentNo = comment.getCommentNo();
        this.comment = comment.getComment();
        this.createdDate = formatDate(comment.getCreatedDate());
        this.modifiedDate = formatDate(comment.getModifiedDate());
        this.poNum = (comment.getPost() != null) ? comment.getPost().getPoNum() : null;
        this.name = (comment.getUser() != null) ? comment.getUser().getName() : "Anonymous"; // 작성자 이름
        this.id = (comment.getUser() != null) ? comment.getUser().getId() : null; // 댓글 작성자 ID
    }

    // 날짜 포맷팅 메서드
    private String formatDate(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm"));
    }
}