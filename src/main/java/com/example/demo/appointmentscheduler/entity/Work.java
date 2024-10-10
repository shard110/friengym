package com.example.demo.appointmentscheduler.entity;

import java.util.List;
import jakarta.persistence.*; // 모든 JPA 관련 어노테이션을 임포트
import com.example.demo.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "works") // 데이터베이스의 'works' 테이블과 매핑
public class Work {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 기본 키 자동 생성 전략
    private Integer id;

    @Column(name = "name") // 'name' 컬럼과 매핑
    private String name;

    @Column(name = "description") // 'description' 컬럼과 매핑
    private String description;

    @Column(name = "price") // 'price' 컬럼과 매핑
    private double price;

    @Column(name = "duration") // 'duration' 컬럼과 매핑 (단위: 분)
    private int duration;

    @Column(name = "editable") // 'editable' 컬럼과 매핑 (수정 가능 여부)
    private boolean editable;

    @Column(name = "target") // 'target' 컬럼과 매핑 (대상 고객)
    private String targetCustomer;

    @ManyToMany // 다대다 관계 설정
    @JoinTable(
            name = "works_trainers", // 중간 테이블 'works_trainers'와 매핑
            joinColumns = @JoinColumn(name = "id_work"), // 'id_work' 컬럼
            inverseJoinColumns = @JoinColumn(name = "id_trainer") // 'id_trainer' 컬럼
    )
    private List<User> trainers; // 트레이너 목록

    // 기본 생성자
    public Work() {
    }

    // Getter 및 Setter 메소드
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public boolean getEditable() {
        return editable;
    }

    public void setEditable(boolean editable) {
        this.editable = editable;
    }

    public String getTargetCustomer() {
        return targetCustomer;
    }

    public void setTargetCustomer(String targetCustomer) {
        this.targetCustomer = targetCustomer;
    }

    public List<User> getTrainers() {
        return trainers;
    }

    public void setTrainers(List<User> trainers) {
        this.trainers = trainers;
    }

    // equals 메소드 (객체 비교)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Work)) return false;
        Work work = (Work) o;
        return id != null && id.equals(work.id); // ID가 같으면 같은 객체로 간주
    }

    // hashCode 메소드 (해시 코드 생성)
    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0; // ID가 null일 경우 0 반환
    }
}