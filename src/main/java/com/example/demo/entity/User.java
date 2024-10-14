package com.example.demo.entity;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Table(name = "usertbl")
public class User {
    @Id
    @NotNull
    private String id;

    @JsonIgnore
    @NotNull
    private String pwd; // 비밀번호 해시값

    @NotNull
    private String name;
    
    @NotNull
    private String phone;

    @NotNull
    private String sex;

    @NotNull
    private String email; // 이메일 필드 추가

    private Integer height;
    private Integer weight;
    private Date birth;
    private Date firstday; // 등록일자 (Date 타입으로 변경)
    private Integer restday; // 남은 일수
    private String photo;
    private String sessionkey;
    private Date sessionlimit;

        // Status enum 추가 (선택적)
    @Enumerated(EnumType.STRING) // ENUM을 문자열로 저장
    private Status status; // 상태 필드 (선택적)

    @ManyToMany
    @JoinTable(
        name = "user_likes",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "post_id")
    )
    private Set<Post> likedPosts = new HashSet<>(); // 좋아요를 누른 게시글 목록

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> posts;
    
    @OneToMany(mappedBy = "follower", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Follow> following;
    
    @OneToMany(mappedBy = "following", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Follow> followers;



}
