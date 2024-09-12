package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "master")
@Data
public class Master {

    @Id
    private String mid;  // 관리자 아이디

    private String mpwd; // 관리자 패스워드
}