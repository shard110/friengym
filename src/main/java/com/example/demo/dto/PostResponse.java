package com.example.demo.dto;

import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import com.example.demo.entity.Post;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostResponse {
    private int poNum;
    private String poContents;
    private String createdDate;
    private String modifiedDate;
    private int viewCnt;
    private String name;
    private String id;  // 필드 추가
    private String fileUrl;
    private List<CommentResponse> comments;
    private int commentCount;
    private int likes;
    private UserResponse user; // User 정보를 담을 DTO 객체로 매핑

    // 기존 생성자
    public PostResponse(Post post) {
        this.poNum = post.getPoNum();
        this.poContents = post.getPoContents();
        this.createdDate = post.getPoDate() != null ? 
                           post.getPoDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")) : "No Date";
        this.modifiedDate = post.getUpdatedDate() != null ? 
                            post.getUpdatedDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")) : "No Date";
        this.viewCnt = post.getViewCnt();
        this.likes = post.getLikes();
        this.name = post.getUser() != null ? post.getUser().getName() : "Unknown";
        this.id = post.getUser() != null ? post.getUser().getId() : "Unknown"; // id 필드 설정
        this.fileUrl = post.getFileUrl(); // 파일 URL 추가
        this.comments = post.getComments() != null ? 
                        post.getComments().stream()
                            .map(CommentResponse::new)
                            .collect(Collectors.toList()) 
                        : Collections.emptyList();
        this.commentCount = this.comments.size(); // 댓글 수 설정
        this.user = new UserResponse(post.getUser()); // UserResponse로 변환
    }

    // 댓글 수를 포함하는 생성자
    public PostResponse(Post post, int commentCount) {
        this.poNum = post.getPoNum();
        this.poContents = post.getPoContents();
        this.createdDate = post.getPoDate() != null ? 
                           post.getPoDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm")) : "No Date";
        this.modifiedDate = post.getUpdatedDate() != null ? 
                            post.getUpdatedDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm")) : "No Date";
        this.viewCnt = post.getViewCnt();
        this.name = post.getUser() != null ? post.getUser().getName() : "Unknown";
        this.id = post.getUser() != null ? post.getUser().getId() : "Unknown"; // id 필드 설정
        this.fileUrl = post.getFileUrl(); // 파일 URL 추가
        this.comments = post.getComments() != null ? 
                        post.getComments().stream()
                            .map(CommentResponse::new)
                            .collect(Collectors.toList()) 
                        : Collections.emptyList();
        this.commentCount = commentCount; // 댓글 수 설정
    }
}