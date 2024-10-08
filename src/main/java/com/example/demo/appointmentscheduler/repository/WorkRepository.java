package com.example.demo.appointmentscheduler.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.appointmentscheduler.entity.Work;

import java.util.List;

public interface WorkRepository extends JpaRepository<Work, Integer> {

    // 특정 트레이너가 제공하는 모든 작업을 찾습니다.
    @Query("select w from Work w inner join w.trainers t where t.id in :trainerId") // provider를 trainer로 변경
    List<Work> findByTrainerId(@Param("trainerId") int trainerId); // 메서드 이름 변경

    // 특정 타겟 고객을 위한 모든 작업을 찾습니다.
    @Query("select w from Work w where w.targetCustomer = :target")
    List<Work> findByTargetCustomer(@Param("target") String targetCustomer);

    // 특정 트레이너가 제공하는 특정 타겟 고객을 위한 작업을 찾습니다.
    @Query("select w from Work w inner join w.trainers t where t.id in :trainerId and w.targetCustomer = :target") // provider를 trainer로 변경
    List<Work> findByTargetCustomerAndTrainerId(@Param("target") String targetCustomer, 
                                                 @Param("trainerId") int trainerId); // 메서드 이름 변경
}
