package com.example.demo.appointmentscheduler.service.impl;


import org.springframework.stereotype.Service;
import com.example.demo.appointmentscheduler.entity.WorkingPlan;
import com.example.demo.appointmentscheduler.model.TimePeriod;
import com.example.demo.appointmentscheduler.repository.WorkingPlanRepository;
import com.example.demo.appointmentscheduler.service.WorkingPlanService;

import jakarta.persistence.EntityNotFoundException;

@Service
public class WorkingPlanServiceImpl implements WorkingPlanService {

    private final WorkingPlanRepository workingPlanRepository;

    public WorkingPlanServiceImpl(WorkingPlanRepository workingPlanRepository) {
        this.workingPlanRepository = workingPlanRepository;
    }

    // 제공자의 작업 계획을 업데이트합니다.
    @Override
    public void updateWorkingPlan(WorkingPlan updateData) {
        WorkingPlan workingPlan = workingPlanRepository.findById(updateData.getId())
                .orElseThrow(() -> new EntityNotFoundException("Working Plan not found"));
        
        // 작업 시간 업데이트
        workingPlan.getMonday().setWorkingHours(updateData.getMonday().getWorkingHours());
        workingPlan.getTuesday().setWorkingHours(updateData.getTuesday().getWorkingHours());
        workingPlan.getWednesday().setWorkingHours(updateData.getWednesday().getWorkingHours());
        workingPlan.getThursday().setWorkingHours(updateData.getThursday().getWorkingHours());
        workingPlan.getFriday().setWorkingHours(updateData.getFriday().getWorkingHours());
        workingPlan.getSaturday().setWorkingHours(updateData.getSaturday().getWorkingHours());
        workingPlan.getSunday().setWorkingHours(updateData.getSunday().getWorkingHours());
        
        workingPlanRepository.save(workingPlan);
    }

    // 작업 계획에 휴식을 추가합니다.
    @Override
    public void addBreakToWorkingPlan(TimePeriod breakToAdd, int planId, String dayOfWeek) {
        WorkingPlan workingPlan = workingPlanRepository.findById(planId)
                .orElseThrow(() -> new EntityNotFoundException("Working Plan not found"));

        // 휴식 추가
        workingPlan.getDay(dayOfWeek).getBreaks().add(breakToAdd);
        workingPlanRepository.save(workingPlan);
    }

    // 작업 계획에서 휴식을 삭제합니다.
    @Override
    public void deleteBreakFromWorkingPlan(TimePeriod breakToDelete, int planId, String dayOfWeek) {
        WorkingPlan workingPlan = workingPlanRepository.findById(planId)
                .orElseThrow(() -> new EntityNotFoundException("Working Plan not found"));

        // 휴식 삭제
        workingPlan.getDay(dayOfWeek).getBreaks().remove(breakToDelete);
        workingPlanRepository.save(workingPlan);
    }

    // 제공자의 작업 계획을 가져옵니다.
    @Override
    public WorkingPlan getWorkingPlanByTrainerId(String trainerId) {
        return workingPlanRepository.getWorkingPlanByTrainerId(trainerId);
    }
}