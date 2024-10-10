package com.example.demo.appointmentscheduler.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.appointmentscheduler.entity.Trainer;

import java.util.List;

public interface TrainerRepository extends JpaRepository<Trainer, String> { 


    List<Trainer> findByTrainerIdContaining(String trainerId); 
    List<Trainer> findByTpwdContaining(String tpwd);

    @Query("SELECT t FROM Trainer t WHERE t.trainerId LIKE %:keyword% OR t.tpwd LIKE %:keyword%") 
    List<Trainer> findByTrainerIdOrTpwd(@Param("keyword") String keyword);

    @Query("SELECT t FROM Trainer t WHERE t.trainerId LIKE %:trainerId% AND t.tpwd LIKE %:tpwd%") 
    List<Trainer> findByTrainerIdAndTpwd(@Param("trainerId") String trainerId, @Param("tpwd") String tpwd);
}