package com.example.demo.appointmentscheduler.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.appointmentscheduler.entity.Work;
import com.example.demo.appointmentscheduler.exception.WorkNotFoundException;
import com.example.demo.appointmentscheduler.repository.WorkRepository;
import com.example.demo.appointmentscheduler.service.CustomerService;
import com.example.demo.appointmentscheduler.service.WorkService;

@Service
public class WorkServiceImpl implements WorkService {

    private final WorkRepository workRepository;
    private final CustomerService customerService;

    public WorkServiceImpl(WorkRepository workRepository, CustomerService customerService) {
        this.workRepository = workRepository;
        this.customerService = customerService;
    }

    // 트레이너가 새로운 작업 생성 가능
    @Override
    public void createNewWork(Work work) {
        workRepository.save(work); // 작업을 데이터베이스에 저장
    }

    // 관리자만 작업 정보 업데이트 가능
    @Override
    public void updateWork(Work workUpdateData) {
        Work work = getWorkById(workUpdateData.getId()); // 작업 ID로 기존 작업을 가져옴
        work.setName(workUpdateData.getName()); // 작업 이름 업데이트
        work.setPrice(workUpdateData.getPrice()); // 작업 가격 업데이트
        work.setDuration(workUpdateData.getDuration()); // 작업 기간 업데이트
        work.setDescription(workUpdateData.getDescription()); // 작업 설명 업데이트
        work.setEditable(workUpdateData.getEditable()); // 수정 가능 여부 업데이트
        work.setTargetCustomer(workUpdateData.getTargetCustomer()); // 대상 고객 업데이트
        workRepository.save(work); // 업데이트된 작업을 데이터베이스에 저장
    }

    // 작업 ID로 작업 객체 가져오기
    @Override
    public Work getWorkById(int workId) {
        return workRepository.findById(workId).orElseThrow(WorkNotFoundException::new); // 작업을 찾지 못할 경우 예외 발생
    }

    // 모든 작업 목록 가져오기
    @Override
    public List<Work> getAllWorks() {
        return workRepository.findAll(); // 모든 작업을 데이터베이스에서 가져옴
    }

    // 관리자만 작업 삭제 가능
    @Override
    public void deleteWorkById(int workId) {
        workRepository.deleteById(workId); // 작업 ID로 작업 삭제
    }

    // 고객이 해당 작업에 적합한지 확인
    @Override
    public boolean isWorkForCustomer(int workId, String customerId) {
        Work work = getWorkById(workId); // 작업 정보를 가져옴
    
        // 작업대상 고객 확인
        return work.getTargetCustomer().equals("customer"); // 고객에 대한 적합성 확인
    }
    // 트레이너 ID로 작업 목록 가져오기
    @Override
    public List<Work> getWorksByTrainerId(String trainerId) {
        return workRepository.findByTrainerId(trainerId); // 트레이너 ID에 따라 작업 목록을 가져옴
    }

    //☆
    @Override
    public List<Work> getWorksForCustomerByTrainerId(String trainerId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getWorksForCustomerByTrainerId'");
    }
}