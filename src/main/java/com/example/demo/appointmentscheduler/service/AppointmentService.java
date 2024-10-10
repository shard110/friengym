package com.example.demo.appointmentscheduler.service;

// 필요한 라이브러리와 클래스 임포트
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.example.demo.appointmentscheduler.entity.Appointment;
import com.example.demo.appointmentscheduler.entity.Work;
import com.example.demo.appointmentscheduler.model.TimePeriod;

// 예약 관리와 관련된 메소드 정의
public interface AppointmentService {

    // 새로운 예약을 생성하는 메소드
    void createNewAppointment(int workId, String trainerId, String customerId, LocalDateTime start);

    // 기존 예약을 업데이트하는 메소드
    void updateAppointment(Appointment appointment);

    // 특정 사용자의 예약 상태를 업데이트하는 메소드
    void updateUserAppointmentsStatuses(String userId);

    // 모든 예약 상태를 업데이트하는 메소드
    void updateAllAppointmentsStatuses();

    // 만료된 교환 요청이 있는 예약의 상태를 업데이트하는 메소드
    void updateAppointmentsStatusesWithExpiredExchangeRequest();

    // 예약 ID로 예약을 삭제하는 메소드
    void deleteAppointmentById(int appointmentId);

    // 권한을 확인하면서 예약 정보를 가져오는 메소드
    Appointment getAppointmentByIdWithAuthorization(int id, String customerId);

    // 예약 ID로 예약 정보를 가져오는 메소드
    Appointment getAppointmentById(int id);

    // 모든 예약 정보를 가져오는 메소드
    List<Appointment> getAllAppointments();

    // 특정 고객 ID로 예약 목록을 가져오는 메소드
    List<Appointment> getAppointmentByCustomerId(String customerId);

    // 특정 트레이너 ID로 예약 목록을 가져오는 메소드
    List<Appointment> getAppointmentByTrainerId(String trainerId);

    // 특정 트레이너와 날짜로 예약 목록을 가져오는 메소드
    List<Appointment> getAppointmentsByTrainerAtDay(String trainerId, LocalDate day);

    // 특정 고객과 날짜로 예약 목록을 가져오는 메소드
    List<Appointment> getAppointmentsByCustomerAtDay(String customerId, LocalDate day);

    // 특정 고객 ID로 확인된 예약 목록을 가져오는 메소드
    List<Appointment> getConfirmedAppointmentsByCustomerId(String customerId);

    // 특정 고객 ID로 현재 월에 취소된 예약 수를 가져오는 메소드
    List<Appointment> getCanceledAppointmentsByCustomerIdForCurrentMonth(String userId);

    // 특정 날짜에 사용 가능한 시간을 가져오는 메소드
    List<TimePeriod> getAvailableHours(String trainerId, String customerId, int workId, LocalDate date);

    // 사용 가능한 시간대에서 근무 정보를 기반으로 가능한 시간을 계산하는 메소드
    List<TimePeriod> calculateAvailableHours(List<TimePeriod> availableTimePeriods, Work work);

    // 예약 목록에서 특정 시간대를 제외하는 메소드
    List<TimePeriod> excludeAppointmentsFromTimePeriods(List<TimePeriod> periods, List<Appointment> appointments);

    // 예약 취소가 허용되지 않는 이유를 반환하는 메소드
    String getCancelNotAllowedReason(String userId, int appointmentId);

    // 사용자 ID로 예약을 취소하는 메소드
    void cancelUserAppointmentById(int appointmentId, String userId);

    // 특정 고객이 예약을 거부할 수 있는지 확인하는 메소드
    boolean isCustomerAllowedToRejectAppointment(String customerId, int appointmentId);

    // 예약 거부 요청을 하는 메소드
    boolean requestAppointmentRejection(int appointmentId, String customerId);

    // 토큰을 사용하여 예약 거부 요청을 하는 메소드
    boolean requestAppointmentRejection(String token);

    // 트레이너가 거부를 수락할 수 있는지 확인하는 메소드
    boolean isTrainerAllowedToAcceptRejection(String trainerId, int appointmentId);

    // 예약 거부를 수락하는 메소드
    boolean acceptRejection(int appointmentId, String trainerId);

    // 토큰을 사용하여 예약 거부를 수락하는 메소드
    boolean acceptRejection(String token);

    // 특정 사용자 ID로 취소된 예약 수를 가져오는 메소드
    int getNumberOfCanceledAppointmentsForUser(String userId);

    // 특정 사용자 ID로 예약된 예약 수를 가져오는 메소드
    int getNumberOfScheduledAppointmentsForUser(String userId);

    // 특정 시간에 예약 가능 여부를 확인하는 메소드
    boolean isAvailable(int workId, String trainerId, String customerId, LocalDateTime start);
}