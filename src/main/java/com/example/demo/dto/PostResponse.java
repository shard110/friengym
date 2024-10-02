package com.example.demo.dto;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import com.example.demo.entity.Post;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostResponse {
    private Integer poNum;
    private String poContents;
    private String createdDate;
    private LocalDateTime poDate;
    private int viewCnt;
    private String name;
    private String id;  // 필드 추가
    private String fileUrl;
    private List<CommentResponse> comments;
    private int commentCount;
    private int likes;
    private UserResponse user; // User 정보를 담을 DTO 객체로 매핑
    private List<String> hashtags;

    // Post와 CommentResponse 리스트를 인자로 받는 생성자
    public PostResponse(Post post, List<CommentResponse> comments) {
        this.poNum = post.getPoNum();
        this.poContents = post.getPoContents();
        this.poDate = post.getPoDate();
        this.createdDate = post.getPoDate() != null ?
                           post.getPoDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")) : "No Date";
        this.viewCnt = post.getViewCnt();
        this.likes = post.getLikes();
        this.name = post.getUser() != null ? post.getUser().getName() : "Unknown";
        this.id = post.getUser() != null ? post.getUser().getId() : "Unknown"; // id 필드 설정
        this.fileUrl = post.getFileUrl(); // 파일 URL 추가
        this.comments = comments;
        this.commentCount = this.comments.size(); // 댓글 수 설정
        this.user = new UserResponse(post.getUser()); // UserResponse로 변환
        this.hashtags = post.getHashtags().stream()
                .map(hashtag -> hashtag.getTag())
                .collect(Collectors.toList());

    }

}