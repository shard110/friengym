package com.example.demo.appointmentscheduler.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.example.demo.appointmentscheduler.entity.Appointment;
import com.example.demo.appointmentscheduler.entity.Work;
import com.example.demo.appointmentscheduler.model.TimePeriod;

public interface AppointmentService {

    // 새로운 예약을 생성하는 메소드
    void createNewAppointment(int workId, String trainerId, String customerId, LocalDateTime start);

    // 기존 예약을 업데이트하는 메소드
    void updateAppointment(Appointment appointment);

    // 예약 ID로 예약을 삭제하는 메소드
    void deleteAppointmentById(int appointmentId);

    // 예약 ID로 예약 정보를 가져오는 메소드
    Appointment getAppointmentById(int id);

    // 모든 예약 정보를 가져오는 메소드
    List<Appointment> getAllAppointments();

    // 특정 고객 ID로 예약 목록을 가져오는 메소드
    List<Appointment> getAppointmentByCustomerId(String customerId);

    // 특정 트레이너 ID로 예약 목록을 가져오는 메소드
    List<Appointment> getAppointmentByTrainerId(String trainerId);

    // 특정 날짜에 사용 가능한 시간을 가져오는 메소드
    List<TimePeriod> getAvailableHours(String trainerId, String customerId, int workId, LocalDate date);

    // 특정 시간에 예약 가능 여부를 확인하는 메소드
    boolean isAvailable(int workId, String trainerId, String customerId, LocalDateTime start);

    // 계산된 사용 가능한 시간대 리스트
    List<TimePeriod> calculateAvailableHours(List<TimePeriod> availableTimePeriods, Work work); // 메소드 추가

    List<TimePeriod> excludeAppointmentsFromTimePeriods(List<TimePeriod> periods, List<Appointment> appointments);
}