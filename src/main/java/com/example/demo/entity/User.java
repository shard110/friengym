package com.example.demo.entity;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;


@Entity
@Table(name = "usertbl")
public class User {
    @Id
    @NotNull
    private String id;

    @NotNull
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
    private Date firstday; // 등록일자 (Date 타입으로 변경)
    private Integer restday; // 남은 일수
    private String photo;
    private String sessionkey;
    private Date sessionlimit;

        // Status enum 추가 (선택적)
    @Enumerated(EnumType.STRING) // ENUM을 문자열로 저장
    private Status status; // 상태 필드 (선택적)

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPwd() {
        return pwd;
    }

    public void setPwd(String pwd) {
        this.pwd = pwd;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public Integer getWeight() {
        return weight;
    }

    public void setWeight(Integer weight) {
        this.weight = weight;
    }

    public Date getBirth() {
        return birth;
    }

    public void setBirth(Date birth) {
        this.birth = birth;
    }

    public Date getFirstday() {
        return firstday; // Date 타입으로 변경
    }

    public void setFirstday(Date firstday) {
        this.firstday = firstday; // Date 타입으로 변경
    }

    public Integer getRestday() {
        return restday;
    }

    public void setRestday(Integer restday) {
        this.restday = restday;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public String getSessionkey() {
        return sessionkey;
    }

    public void setSessionkey(String sessionkey) {
        this.sessionkey = sessionkey;
    }

    public Date getSessionlimit() {
        return sessionlimit;
    }

    public void setSessionlimit(Date sessionlimit) {
        this.sessionlimit = sessionlimit;
    }
}
