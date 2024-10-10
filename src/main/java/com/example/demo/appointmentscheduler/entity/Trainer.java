package com.example.demo.appointmentscheduler.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "trainer") // 테이블 이름을 trainer로 변경
@Data
public class Trainer { // 클래스 이름 변경

    @Id
    private String trainerId;  // 트레이너 아이디 (mid에서 tid로 변경)

    private String tpwd; // 트레이너 패스워드 (mpwd에서 tpwd로 변경)

    private WorkingPlan workingPlan; // WorkingPlan 필드 추가
}