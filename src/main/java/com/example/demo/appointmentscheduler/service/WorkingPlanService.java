package com.example.demo.appointmentscheduler.service;

import com.example.demo.appointmentscheduler.entity.WorkingPlan;
import com.example.demo.appointmentscheduler.model.TimePeriod;

public interface WorkingPlanService {
   
    // 트레이너의 근무 계획을 업데이트하는 메서드
    void updateWorkingPlan(WorkingPlan workingPlan);

    // 근무 계획에 휴식 시간을 추가하는 메서드
    void addBreakToWorkingPlan(TimePeriod breakToAdd, int planId, String dayOfWeek);

    // 근무 계획에서 휴식 시간을 삭제하는 메서드
    void deleteBreakFromWorkingPlan(TimePeriod breakToDelete, int planId, String dayOfWeek);

    // 특정 트레이너 ID에 대한 근무 계획을 가져오는 메서드
    WorkingPlan getWorkingPlanByTrainerId(String trainerId);
}