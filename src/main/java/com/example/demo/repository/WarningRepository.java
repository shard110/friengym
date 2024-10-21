package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Warning;
import com.example.demo.entity.Post;

@Repository
public interface WarningRepository extends JpaRepository<Warning, Integer> {
    List<Warning> findByPostPoNum(Integer poNum);
    
    // 특정 게시글에 대한 경고 삭제
    void deleteByPost(Post post);
}