package com.example.demo.dto;

import com.example.demo.entity.User;

public class UserResponse {
    private String id;
    private String photo;

    // 생성자: User 엔터티를 받아서 필요한 필드를 초기화
    public UserResponse(User user) {
        this.id = user.getId();
        this.photo = user.getPhoto();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }
}
