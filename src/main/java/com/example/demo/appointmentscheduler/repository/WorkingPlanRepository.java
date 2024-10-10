package com.example.demo.appointmentscheduler.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.appointmentscheduler.entity.WorkingPlan;


public interface WorkingPlanRepository extends JpaRepository<WorkingPlan, Integer> {

    // 특정 제공자의 작업 계획을 찾습니다.
    @Query("select w from WorkingPlan w where w.trainer.id = :trainerId")
    WorkingPlan getWorkingPlanByTrainerId(@Param("trainerId") String trainerId);
}