package com.example.demo.dto;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import com.example.demo.entity.Post;
import com.fasterxml.jackson.annotation.JsonProperty;

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

    @JsonProperty("userName")
    private String userName;  // 변경: name에서 userName으로 이름 변경

    @JsonProperty("userId")
    private String userId;    // 변경: id에서 userId로 이름 변경

    @JsonProperty("userPhoto")
    private String userPhoto; // 사용자 프로필 사진 추가
    private String fileUrl;
    private List<CommentResponse> comments;
    private int commentCount;
    private int likes;
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
        this.userName = post.getUser() != null ? post.getUser().getName() : "Unknown";
        this.userId = post.getUser() != null ? post.getUser().getId() : "Unknown";
        this.userPhoto = post.getUser() != null ? post.getUser().getPhoto() : null;
        this.fileUrl = post.getFileUrl(); // 파일 URL 추가
        this.comments = comments;
        this.commentCount = this.comments.size(); // 댓글 수 설정
        this.hashtags = post.getHashtags().stream()
                .map(hashtag -> hashtag.getTag())
                .collect(Collectors.toList());

    }

    // Post 객체만을 받는 생성자 추가
    public PostResponse(Post post) {
    this.poNum = post.getPoNum();
    this.poContents = post.getPoContents();
    this.poDate = post.getPoDate();
    this.createdDate = post.getPoDate() != null ?
                       post.getPoDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")) : "No Date";
    this.viewCnt = post.getViewCnt();
    this.likes = post.getLikes();
    this.userName = post.getUser() != null ? post.getUser().getName() : "Unknown";
    this.userId = post.getUser() != null ? post.getUser().getId() : "Unknown";
    this.userPhoto = post.getUser() != null ? post.getUser().getPhoto() : null;
    this.fileUrl = post.getFileUrl();
    this.hashtags = post.getHashtags().stream()
            .map(hashtag -> hashtag.getTag())
            .collect(Collectors.toList());
}


}