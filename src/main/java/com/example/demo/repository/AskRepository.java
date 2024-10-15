package com.example.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Ask;

public interface AskRepository extends JpaRepository<Ask, Integer> {

     // 특정 작성자의 글을 최신 순으로 조회
    Page<Ask> findByUserIdOrderByADateDesc(String userId, Pageable pageable);
    
    // 모든 글을 최신 순으로 조회
    Page<Ask> findAllByOrderByADateDesc(Pageable pageable);

    Page<Ask> findByUserId(String id, Pageable pageable);
}
