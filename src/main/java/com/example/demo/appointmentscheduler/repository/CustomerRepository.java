package com.example.demo.appointmentscheduler.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.appointmentscheduler.entity.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {
    // 추가적인 쿼리 메서드를 정의할 수 있습니다.
    
    // 예: 고객 이름으로 검색하는 메서드
    List<Customer> findByNameContaining(String name);
    
    // 예: 이메일로 고객 찾기 (id로찾기로 수정)
    // Optional<Customer> findByEmail(String email);
}