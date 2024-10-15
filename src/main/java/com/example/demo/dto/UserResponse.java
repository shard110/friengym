package com.example.demo.dto;

import java.util.Date;

import com.example.demo.entity.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponse {
    private String id;
    private String photo;
    private String name;
    private String phone;
    private String sex;
    private Integer height;
    private Integer weight;
    private String birth;
    private Date firstday;
    private Integer restday;
    private String introduction; // 소개 필드 추가

    // 생성자: User 엔터티를 받아서 필요한 필드를 초기화
    public UserResponse(User user) {
        this.id = user.getId();
        this.photo = user.getPhoto();
        this.name = user.getName();
        this.phone = user.getPhone();
        this.sex = user.getSex();
        this.height = user.getHeight();
        this.weight = user.getWeight();
        this.birth = user.getBirth() != null ? user.getBirth().toString() : null;
        this.firstday = user.getFirstday();
        this.restday = user.getRestday();
        this.introduction = user.getIntroduction();  // 소개 정보 추가
    }
    
}
