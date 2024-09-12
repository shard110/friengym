package com.example.demo.entity;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "comments")
@EntityListeners(AuditingEntityListener.class)  
public class Comment {

    //수정*임시//
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_no")
    private Integer commentNo; // ☆댓글 ID
    //수정*임시//

    @Column(name = "comment", columnDefinition = "TEXT", nullable = false)
    private String comment; // ☆댓글 내용

    @Column(name = "created_date", updatable = false)
    @CreatedDate
    private LocalDateTime createdDate; // 댓글 작성 시간

    @Column(name = "modified_date")
    @LastModifiedDate
    private LocalDateTime modifiedDate; // 댓글 수정 시간

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "ponum", nullable = false)   //오타수정
    private Post post; // 댓글이 달린 게시글

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "id", nullable = false)
    private User user; // 댓글 작성자

    @PrePersist
    public void prePersist() {
        if (createdDate == null) {
            createdDate = LocalDateTime.now();
        }
    }

    @PreUpdate
    public void preUpdate() {
        modifiedDate = LocalDateTime.now();
    }

    
    @Builder
    public Comment(Integer commentNo, String comment, User user, Post post) {
        this.commentNo = commentNo;
        this.comment = comment;
        this.user = user;
        this.post = post;
    }
}