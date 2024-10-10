package com.example.demo.appointmentscheduler.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "trainer")
@Data
public class Trainer {

    @Id
    private String trainerId;

    private String tpwd;

    @OneToOne(mappedBy = "trainer", cascade = CascadeType.ALL)
    private WorkingPlan workingPlan; // WorkingPlan과의 관계 설정
}