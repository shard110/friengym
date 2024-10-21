package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;

public class UserDTO {
    private String id;
    private String name;
    private String phone;
    private String email;
    private String sex;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd") // 포맷 지정
    private Date birth;  

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd") // 포맷 지정
    private Date firstday;  

    private Integer restday;

    public UserDTO() {}

    // 장바구니에서 씀
    public UserDTO(String id) {
        this.id = id;
    }

    // Constructor
    public UserDTO(String id, String name, String phone, String email, String sex, Date birth, Date firstday, Integer restday) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.sex = sex;
        this.birth = birth;
        this.firstday = firstday;
        this.restday = restday;
    }

    // Getter와 Setter
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public Date getBirth() {
        return birth;
    }

    public void setBirth(Date birth) {
        this.birth = birth;
    }

    public Date getFirstday() {
        return firstday;
    }

    public void setFirstday(Date firstday) {
        this.firstday = firstday;
    }

    public Integer getRestday() {
        return restday;
    }

    public void setRestday(Integer restday) {
        this.restday = restday;
    }
}
