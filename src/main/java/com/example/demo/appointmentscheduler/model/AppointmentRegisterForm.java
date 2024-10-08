package com.example.demo.appointmentscheduler.model;

import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDateTime; // LocalDateTime 임포트 추가

// 약속 등록을 위한 폼 데이터
public class AppointmentRegisterForm {

    // 작업 ID
    private int workId;

    // 트레이너 ID
    private int trainerId;

    // 고객 ID
    private int customerId;

    // 약속 시작 시간 (포맷: yyyy-MM-dd'T'HH:mm)
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime start;

    // 약속 종료 시간 (포맷: yyyy-MM-dd'T'HH:mm)
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime end;

    // 기본 생성자
    public AppointmentRegisterForm() {
    }

    // 작업 ID, 트레이너 ID, 시작 시간, 종료 시간으로 초기화하는 생성자
    public AppointmentRegisterForm(int workId, int trainerId, LocalDateTime start, LocalDateTime end) {
        this.workId = workId;
        this.trainerId = trainerId;
        this.start = start;
        this.end = end;
    }

    // 작업 ID 반환
    public int getWorkId() {
        return workId;
    }

    // 작업 ID 설정
    public void setWorkId(int workId) {
        this.workId = workId;
    }

    // 트레이너 ID 반환
    public int getTrainerId() {
        return trainerId;
    }

    // 트레이너 ID 설정
    public void setTrainerId(int trainerId) {
        this.trainerId = trainerId;
    }

    // 약속 시작 시간 반환
    public LocalDateTime getStart() {
        return start;
    }

    // 약속 시작 시간 설정
    public void setStart(LocalDateTime start) {
        this.start = start;
    }

    // 약속 종료 시간 반환
    public LocalDateTime getEnd() {
        return end;
    }

    // 약속 종료 시간 설정
    public void setEnd(LocalDateTime end) {
        this.end = end;
    }

    // 고객 ID 반환
    public int getCustomerId() {
        return customerId;
    }

    // 고객 ID 설정
    public void setCustomerId(int customerId) {
        this.customerId = customerId;
    }
}