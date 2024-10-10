package com.example.demo.appointmentscheduler.service.impl;

import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.example.demo.appointmentscheduler.entity.Appointment;
import com.example.demo.appointmentscheduler.entity.AppointmentStatus;
import com.example.demo.appointmentscheduler.entity.Trainer;
import com.example.demo.appointmentscheduler.entity.Work;
import com.example.demo.appointmentscheduler.entity.WorkingPlan;
import com.example.demo.appointmentscheduler.exception.AppointmentNotFoundException;
import com.example.demo.appointmentscheduler.model.DayPlan;
import com.example.demo.appointmentscheduler.model.TimePeriod;
import com.example.demo.appointmentscheduler.repository.AppointmentRepository;
import com.example.demo.appointmentscheduler.service.AppointmentService;
import com.example.demo.appointmentscheduler.service.CustomerService;
import com.example.demo.appointmentscheduler.service.TrainerService;
import com.example.demo.appointmentscheduler.service.WorkService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

// AppointmentServiceImpl 클래스는 AppointmentService 인터페이스를 구현하며,
// 예약 관리 기능을 제공하는 서비스 클래스입니다.
@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final int NUMBER_OF_ALLOWED_CANCELATIONS_PER_MONTH = 1; // 한 달 동안 허용되는 최대 취소 횟수
    private final AppointmentRepository appointmentRepository; // 약속 저장소
    private final WorkService workService; // 작업 서비스
    private final TrainerService trainerService; // 트레이너 서비스
    private final CustomerService customerService; // 고객 서비스

    // 생성자: 서비스 의존성을 주입합니다.
    public AppointmentServiceImpl(AppointmentRepository appointmentRepository, 
                                  WorkService workService, 
                                  TrainerService trainerService, 
                                  CustomerService customerService) {
        this.appointmentRepository = appointmentRepository;
        this.workService = workService;
        this.trainerService = trainerService;
        this.customerService = customerService;
    }

    // 약속 정보를 업데이트합니다.
    @Override
    public void updateAppointment(Appointment appointment) {
        appointmentRepository.save(appointment);
    }

    // 권한에 따라 약속을 조회합니다.
    public Appointment getAppointmentByIdWithAuthorization(int id, String customerId) {
        // 약속 정보를 가져옴
        Appointment appointment = getAppointmentById(id);
        
        // 고객 권한 확인
        if (!appointment.getCustomer().getId().equals(customerId)) {
            throw new RuntimeException("해당 약속에 대한 권한이 없습니다.");
        }
        
        return appointment;
    }

    // 약속 ID로 약속을 조회합니다.
    @Override
    public Appointment getAppointmentById(int id) {
        return appointmentRepository.findById(id)
                .orElseThrow(AppointmentNotFoundException::new);
    }

    // 모든 약속을 조회합니다 (관리자 권한 필요).
    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // 약속 ID로 약속을 삭제합니다.
    @Override
    public void deleteAppointmentById(int id) {
        appointmentRepository.deleteById(id);
    }

    // 특정 고객의 약속을 조회합니다.
    @Override
    @PreAuthorize("#customerId == principal.id")
    public List<Appointment> getAppointmentByCustomerId(String customerId) {
        return appointmentRepository.findByCustomerId(customerId);
    }

    // 특정 트레이너의 약속을 조회합니다.
    @Override
    @PreAuthorize("#trainerId == principal.id")
    public List<Appointment> getAppointmentByTrainerId(String trainerId) {
        return appointmentRepository.findByTrainerId(trainerId);
    }

    // 특정 트레이너의 특정 날짜에 대한 약속을 조회합니다.
    @Override
    public List<Appointment> getAppointmentsByTrainerAtDay(String trainerId, LocalDate day) {
        return appointmentRepository.findByTrainerIdWithStartInPeriod(trainerId, day.atStartOfDay(), day.atStartOfDay().plusDays(1));
    }

    // 특정 고객의 특정 날짜에 대한 약속을 조회합니다.
    @Override
    public List<Appointment> getAppointmentsByCustomerAtDay(String customerId, LocalDate day) {
        return appointmentRepository.findByCustomerIdWithStartInPeriod(customerId, day.atStartOfDay(), day.atStartOfDay().plusDays(1));
    }

    // 특정 트레이너와 고객의 특정 날짜에 가능한 시간을 조회합니다.
    @Override
    public List<TimePeriod> getAvailableHours(String trainerId, String customerId, int workId, LocalDate date) {
        Trainer trainer = trainerService.getTrainerById(trainerId); // 트레이너 정보 가져오기
        WorkingPlan workingPlan = trainer.getWorkingPlan(); // 트레이너의 근무 계획 가져오기
        DayPlan selectedDay = workingPlan.getDay(date.getDayOfWeek().toString().toLowerCase()); // 해당 날짜의 근무 계획 가져오기

        // 해당 트레이너와 고객의 약속 조회
        List<Appointment> trainerAppointments = getAppointmentsByTrainerAtDay(trainerId, date);
        List<Appointment> customerAppointments = getAppointmentsByCustomerAtDay(customerId, date);

        // 사용 가능한 시간대 계산
        List<TimePeriod> availablePeriods = selectedDay.timePeroidsWithBreaksExcluded();
        availablePeriods = excludeAppointmentsFromTimePeriods(availablePeriods, trainerAppointments);
        availablePeriods = excludeAppointmentsFromTimePeriods(availablePeriods, customerAppointments);
        return calculateAvailableHours(availablePeriods, workService.getWorkById(workId)); // 최종 사용 가능한 시간대 반환
    }

    // 새로운 약속을 생성합니다.
    @Override
    public void createNewAppointment(int workId, String trainerId, String customerId, LocalDateTime start) {
        if (isAvailable(workId, trainerId, customerId, start)) {
            Appointment appointment = new Appointment();
            appointment.setStatus(AppointmentStatus.SCHEDULED); // 약속 상태 설정
            appointment.setCustomer(customerService.getCustomerById(customerId)); // 고객 설정
            appointment.setTrainer(trainerService.getTrainerById(trainerId)); // 트레이너 설정
            Work work = workService.getWorkById(workId); // 작업 정보 가져오기
            appointment.setWork(work);
            appointment.setStart(start); // 약속 시작 시간 설정
            appointment.setEnd(start.plusMinutes(work.getDuration())); // 약속 종료 시간 설정
            appointmentRepository.save(appointment); // 약속 저장
            // notificationService.newAppointmentScheduledNotification(appointment, true); // 알림 서비스 호출
        } else {
            throw new RuntimeException("Appointment is not available."); // 사용할 수 없는 시간에 대한 예외 처리
        }
    }

    // 약속 시간대 계산
    @Override
    public List<TimePeriod> calculateAvailableHours(List<TimePeriod> availableTimePeriods, Work work) {
        List<TimePeriod> availableHours = new ArrayList<>();
        for (TimePeriod period : availableTimePeriods) {
            TimePeriod workPeriod = new TimePeriod(period.getStart(), period.getStart().plusMinutes(work.getDuration())); // 작업 시간대 설정
            while (workPeriod.getEnd().isBefore(period.getEnd()) || workPeriod.getEnd().equals(period.getEnd())) {
                availableHours.add(new TimePeriod(workPeriod.getStart(), workPeriod.getStart().plusMinutes(work.getDuration()))); // 사용 가능한 시간대 추가
                workPeriod.setStart(workPeriod.getStart().plusMinutes(work.getDuration())); // 다음 시간대로 이동
                workPeriod.setEnd(workPeriod.getEnd().plusMinutes(work.getDuration())); // 종료 시간 업데이트
            }
        }
        return availableHours; // 사용 가능한 모든 시간대 반환
    }

    // 약속 시간대에서 기존 약속을 제외합니다.
    @Override
    public List<TimePeriod> excludeAppointmentsFromTimePeriods(List<TimePeriod> periods, List<Appointment> appointments) {
        List<TimePeriod> toAdd = new ArrayList<>();
        Collections.sort(appointments); // 약속 정렬
        for (Appointment appointment : appointments) {
            for (TimePeriod period : periods) {
                // 약속이 현재 시간대에 포함될 경우 조정
                if ((appointment.getStart().toLocalTime().isBefore(period.getStart()) || 
                     appointment.getStart().toLocalTime().equals(period.getStart())) && 
                    appointment.getEnd().toLocalTime().isAfter(period.getStart()) && 
                    appointment.getEnd().toLocalTime().isBefore(period.getEnd())) {
                    period.setStart(appointment.getEnd().toLocalTime()); // 시작 시간 조정
                }
                if (appointment.getStart().toLocalTime().isAfter(period.getStart()) && 
                    appointment.getStart().toLocalTime().isBefore(period.getEnd()) && 
                    appointment.getEnd().toLocalTime().isAfter(period.getEnd()) || 
                    appointment.getEnd().toLocalTime().equals(period.getEnd())) {
                    period.setEnd(appointment.getStart().toLocalTime()); // 종료 시간 조정
                }
                if (appointment.getStart().toLocalTime().isAfter(period.getStart()) && 
                    appointment.getEnd().toLocalTime().isBefore(period.getEnd())) {
                    toAdd.add(new TimePeriod(period.getStart(), appointment.getStart().toLocalTime())); // 중간 시간대 추가
                    period.setStart(appointment.getEnd().toLocalTime()); // 시작 시간 조정
                }
            }
        }
        periods.addAll(toAdd); // 새로 추가된 시간대 추가
        Collections.sort(periods); // 정렬
        return periods; // 업데이트된 시간대 반환
    }

    // 사용자 약속 상태 업데이트
    @Override
    public void updateUserAppointmentsStatuses(String userId) {
        // 예정된 약속을 완료로 업데이트
        for (Appointment appointment : appointmentRepository.findScheduledByUserIdWithEndBeforeDate(LocalDateTime.now(), userId)) {
            appointment.setStatus(AppointmentStatus.FINISHED);
            updateAppointment(appointment);
        }
    }



    // 약속이 가능한지 확인
    @Override
    public boolean isAvailable(int workId, String trainerId, String customerId, LocalDateTime start) {
        if (!workService.isWorkForCustomer(workId, customerId)) {
            return false; // 고객에게 해당 작업이 유효하지 않음
        }
        Work work = workService.getWorkById(workId); // 작업 정보 가져오기
        TimePeriod timePeriod = new TimePeriod(start.toLocalTime(), start.toLocalTime().plusMinutes(work.getDuration())); // 약속 시간대 설정
        return getAvailableHours(trainerId, customerId, workId, start.toLocalDate()).contains(timePeriod); // 사용 가능한 시간대에서 확인
    }

    @Override
    public void updateAllAppointmentsStatuses() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateAllAppointmentsStatuses'");
    }

    @Override
    public void updateAppointmentsStatusesWithExpiredExchangeRequest() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateAppointmentsStatusesWithExpiredExchangeRequest'");
    }

    @Override
    public List<Appointment> getConfirmedAppointmentsByCustomerId(String customerId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getConfirmedAppointmentsByCustomerId'");
    }

    @Override
    public List<Appointment> getCanceledAppointmentsByCustomerIdForCurrentMonth(String userId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getCanceledAppointmentsByCustomerIdForCurrentMonth'");
    }

    @Override
    public String getCancelNotAllowedReason(String userId, int appointmentId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getCancelNotAllowedReason'");
    }

    @Override
    public void cancelUserAppointmentById(int appointmentId, String userId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'cancelUserAppointmentById'");
    }

    @Override
    public boolean isCustomerAllowedToRejectAppointment(String customerId, int appointmentId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'isCustomerAllowedToRejectAppointment'");
    }

    @Override
    public boolean requestAppointmentRejection(int appointmentId, String customerId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'requestAppointmentRejection'");
    }

    @Override
    public boolean requestAppointmentRejection(String token) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'requestAppointmentRejection'");
    }

    @Override
    public boolean isTrainerAllowedToAcceptRejection(String trainerId, int appointmentId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'isTrainerAllowedToAcceptRejection'");
    }

    @Override
    public boolean acceptRejection(int appointmentId, String trainerId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'acceptRejection'");
    }

    @Override
    public boolean acceptRejection(String token) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'acceptRejection'");
    }

    @Override
    public int getNumberOfCanceledAppointmentsForUser(String userId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getNumberOfCanceledAppointmentsForUser'");
    }

    @Override
    public int getNumberOfScheduledAppointmentsForUser(String userId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getNumberOfScheduledAppointmentsForUser'");
    }
}
