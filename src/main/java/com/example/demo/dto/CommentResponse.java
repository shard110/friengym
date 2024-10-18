package com.example.demo.dto;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import com.example.demo.entity.Comment;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CommentResponse {

    private Integer commentNo;
    private String comment; //댓글내용
    private String createdDate; // LocalDateTime 대신 String으로 변경
    private String modifiedDate; // LocalDateTime 대신 String으로 변경
    private Integer poNum;

    @JsonProperty("userName")
    private String name; // 작성자 이름

    @JsonProperty("userId")
    private String id; // 댓글 작성자 ID

    @JsonProperty("userPhoto")
    private String photo; // 댓글 작성자의 프로필 사진 추가
    private List<CommentResponse> replies; // 답글들

    /* Entity -> Dto */
    public CommentResponse(Comment comment) {
        this.commentNo = comment.getCommentNo();
        this.comment = comment.getComment();
        this.createdDate = formatDate(comment.getCreatedDate());
        this.modifiedDate = formatDate(comment.getModifiedDate());
        this.poNum = (comment.getPost() != null) ? comment.getPost().getPoNum() : null;
        this.name = (comment.getUser() != null) ? comment.getUser().getName() : "Anonymous"; // 작성자 이름
        this.id = (comment.getUser() != null) ? comment.getUser().getId() : null; // 댓글 작성자 ID
        this.photo = (comment.getUser() != null && comment.getUser().getPhoto() != null) ? comment.getUser().getPhoto() : "default-photo-url"; // 작성자의 프로필 사진
        
         // 답글 처리 (순환 참조 방지)
        if (comment.getReplies() != null && !comment.getReplies().isEmpty()) {
            this.replies = comment.getReplies().stream()
                .map(reply -> new CommentResponse(reply))
                .collect(Collectors.toList());
        }
    }




    // 날짜 포맷팅 메서드
    private String formatDate(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm"));
    }


}