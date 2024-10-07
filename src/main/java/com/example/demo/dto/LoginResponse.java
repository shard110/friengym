package com.example.demo.dto;

import com.example.demo.entity.User;

public class LoginResponse {
    private String token;
    private String userId;  // User 객체 대신 간단한 정보만 포함

    public LoginResponse() {}

    public LoginResponse(String token, User user) {
        this.token = token;
        this.userId = user.getId();  // 여기서 중요한 정보만 포함
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
