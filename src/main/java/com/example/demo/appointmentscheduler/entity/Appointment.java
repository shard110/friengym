package com.example.demo.appointmentscheduler.entity;


import java.time.LocalDateTime;

import org.springframework.format.annotation.DateTimeFormat;

import com.example.demo.appointmentscheduler.model.AppointmentSerializer;
import com.example.demo.entity.User;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "appointments") // 데이터베이스의 'appointments' 테이블과 매핑
@JsonSerialize(using = AppointmentSerializer.class) // 커스텀 직렬 변환기 사용
public class Appointment implements Comparable<Appointment> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 기본 키 자동 생성 전략
    private Integer id;

    @Column(name = "start") // 시작 시간 컬럼
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm") // 날짜 시간 포맷
    private LocalDateTime start;

    @Column(name = "end") // 종료 시간 컬럼
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm") // 날짜 시간 포맷
    private LocalDateTime end;

    @Column(name = "canceled_at") // 취소 시간 컬럼
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm") // 날짜 시간 포맷
    private LocalDateTime canceledAt;

    @OneToOne
    @JoinColumn(name = "id_canceler") // 취소자 ID
    private User canceler;

    @Enumerated(EnumType.STRING) // 약속 상태를 문자열로 저장
    @Column(name = "status") // 상태 컬럼
    private AppointmentStatus status;

    @ManyToOne
    @JoinColumn(name = "id_customer") // 고객 ID
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "id_trainer") // 트레이너 ID로 수정
    private Trainer trainer; // 트레이너

    @ManyToOne
    @JoinColumn(name = "id_work") // 작업 ID
    private Work work;

    // @OneToMany(mappedBy = "appointment") // 채팅 메시지
    // private List<ChatMessage> chatMessages;

    @OneToOne(mappedBy = "requested", cascade = {CascadeType.ALL}) // 교환 요청
    private ExchangeRequest exchangeRequest;

    // 기본 생성자
    public Appointment() {
    }

    // 생성자
    public Appointment(LocalDateTime start, LocalDateTime end, Customer customer, Trainer trainer, Work work) {
        this.start = start;
        this.end = end;
        this.customer = customer;
        this.trainer = trainer; // 트레이너 초기화
        this.work = work;
    }

    // 약속 시작 시간 기준으로 비교
    @Override
    public int compareTo(Appointment o) {
        return this.getStart().compareTo(o.getStart());
    }

    // Getter 및 Setter 메소드
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDateTime getStart() {
        return start;
    }

    public void setStart(LocalDateTime start) {
        this.start = start;
    }

    public LocalDateTime getEnd() {
        return end;
    }

    public void setEnd(LocalDateTime end) {
        this.end = end;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Trainer getTrainer() { // 트레이너 getter
        return trainer;
    }

    public void setTrainer(Trainer trainer) { // 트레이너 setter
        this.trainer = trainer;
    }

    public Work getWork() {
        return work;
    }

    public void setWork(Work work) {
        this.work = work;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }

    // public List<ChatMessage> getChatMessages() {
    //     Collections.sort(chatMessages); // 채팅 메시지 정렬
    //     return chatMessages;
    // }

    public User getCanceler() {
        return canceler;
    }

    public void setCanceler(User canceler) {
        this.canceler = canceler;
    }

    // public void setChatMessages(List<ChatMessage> chatMessages) {
    //     this.chatMessages = chatMessages;
    // }

    public LocalDateTime getCanceledAt() {
        return canceledAt;
    }

    public void setCanceledAt(LocalDateTime canceledAt) {
        this.canceledAt = canceledAt;
    }

}