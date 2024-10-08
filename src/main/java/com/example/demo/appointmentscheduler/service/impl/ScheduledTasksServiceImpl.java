package com.example.appointmentscheduler.service.impl;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.appointmentscheduler.service.AppointmentService;
import com.example.appointmentscheduler.service.ScheduledTasksService;

// ScheduledTasksServiceImpl 클래스는 예약된 작업을 관리합니다.
@Component
public class ScheduledTasksServiceImpl implements ScheduledTasksService {

    private final AppointmentService appointmentService;

    // 생성자
    public ScheduledTasksServiceImpl(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // 매 30분마다 실행되는 메소드
    @Scheduled(fixedDelay = 30 * 60 * 1000)
    @Override
    public void updateAllAppointmentsStatuses() {
        // 만료된 교환 요청 상태 업데이트
        appointmentService.updateAppointmentsStatusesWithExpiredExchangeRequest();
        // 모든 약속 상태 업데이트
        appointmentService.updateAllAppointmentsStatuses();
    }
}