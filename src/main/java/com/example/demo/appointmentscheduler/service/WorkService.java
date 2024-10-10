package com.example.demo.appointmentscheduler.service;

import java.util.List;
import com.example.demo.appointmentscheduler.entity.Work;

// WorkService 인터페이스는 작업(Work) 관련 기능을 정의합니다.
public interface WorkService {

    // 새로운 작업을 생성합니다.
    void createNewWork(Work work);

    // 작업 ID로 작업을 조회합니다.
    Work getWorkById(int workId);

    // 모든 작업을 조회합니다.
    List<Work> getAllWorks();

    // 특정 트레이너에 의해 제공되는 작업을 조회합니다.
    List<Work> getWorksByTrainerId(String trainerId);

    // 트레이너에 의해 제공되는 작업을 조회합니다.
    List<Work> getWorksForCustomerByTrainerId(String trainerId);

    // 작업 정보를 업데이트합니다.
    void updateWork(Work work);

    // 작업 ID로 작업을 삭제합니다.
    void deleteWorkById(int workId);

    // 특정 작업이 고객에게 유효한지 확인합니다.
    boolean isWorkForCustomer(int workId, String customerId);
}