package com.example.demo.repository;

import com.example.demo.entity.Trainer; // 변경된 엔티티 사용
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TrainerRepository extends JpaRepository<Trainer, String> { 


    List<Trainer> findByTidContaining(String tid); 
    List<Trainer> findByTpwdContaining(String tpwd);

    @Query("SELECT t FROM Trainer t WHERE t.tid LIKE %:keyword% OR t.tpwd LIKE %:keyword%") 
    List<Trainer> findByTidOrTpwd(@Param("keyword") String keyword);

    @Query("SELECT t FROM Trainer t WHERE t.tid LIKE %:tid% AND t.tpwd LIKE %:tpwd%") 
    List<Trainer> findByTidAndTpwd(@Param("tid") String tid, @Param("tpwd") String tpwd);
}