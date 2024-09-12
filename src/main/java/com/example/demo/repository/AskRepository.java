package com.example.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Ask;

public interface AskRepository extends JpaRepository<Ask, Integer> {

     // 특정 작성자의 모든 문의글을 페이징 처리하여 조회
     Page<Ask> findByUserId(String userId, Pageable pageable);
}
