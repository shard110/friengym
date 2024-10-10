package com.example.demo.appointmentscheduler.entity;


import java.util.List;

import com.example.demo.entity.User;
import jakarta.persistence.Entity; 
import jakarta.persistence.OneToMany; 
import jakarta.persistence.PrimaryKeyJoinColumn; 
import jakarta.persistence.Table;

@Entity
@Table(name = "customers") // 'customers' 테이블과 매핑
@PrimaryKeyJoinColumn(name = "id_customer") // 상위 클래스 User와 조인할 기본 키 열 설정
public class Customer extends User {

    @OneToMany(mappedBy = "customer") // Customer가 소유한 여러 Appointment와의 관계를 설정
    private List<Appointment> appointments;

    // 기본 생성자
    public Customer() {
        super(); // 상위 클래스(User) 기본 생성자 호출
    }

    // Customer 객체를 생성할 때 필요한 모든 정보를 한 번에 설정
    public Customer(String id, String pwd, String name, String phone, String sex) {
        super(); // 상위 클래스(User) 기본 생성자 호출
        this.setId(id); // ID 설정
        this.setPwd(pwd); // 비밀번호 설정
        this.setName(name); // 이름 설정
        this.setPhone(phone); // 전화번호 설정
        this.setSex(sex); // 성별 설정
    }

    // 예약 목록을 반환하는 getter
    public List<Appointment> getAppointments() {
        return appointments; // 고객의 예약 목록 반환
    }

    // 예약 목록을 설정하는 setter
    public void setAppointments(List<Appointment> appointments) {
        this.appointments = appointments; // 예약 목록 설정
    }
}