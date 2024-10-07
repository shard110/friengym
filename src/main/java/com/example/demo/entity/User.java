package com.example.demo.entity;

import java.sql.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "usertbl")
public class User {
    @Id
    @NotNull
    private String id;

    @NotNull
    // @Size(min = 6, message = "Password must be at least 6 characters long")
    // @Column(length = 60) // BCrypt는 기본적으로 60자의 길이를 요구합니다.
    private String pwd;

    @NotNull
    private String name;
    
    @NotNull
    private String phone;

    @NotNull
    private String sex;

    private Integer height;
    private Integer weight;
    private Date birth;
    private Integer firstday;
    private Integer restday;
    private String photo;
    private String sessionkey;
    private Date sessionlimit;

    @Column(unique=true, nullable=false)
    private String email;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore  // 직렬화에서 제외하여 순환 참조 방지
    private List<Post> posts;
    
    @OneToMany(mappedBy = "follower", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Follow> following;
    
    @OneToMany(mappedBy = "following", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Follow> followers;



}