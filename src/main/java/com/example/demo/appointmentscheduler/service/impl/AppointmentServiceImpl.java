package com.example.demo.appointmentscheduler.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

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

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository; // 예약 저장소
    private final WorkService workService; // 작업 서비스
    private final TrainerService trainerService; // 트레이너 서비스
    private final CustomerService customerService; // 고객 서비스

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository, 
                                  WorkService workService, 
                                  TrainerService trainerService, 
                                  CustomerService customerService) {
        this.appointmentRepository = appointmentRepository;
        this.workService = workService;
        this.trainerService = trainerService;
        this.customerService = customerService;
    }

    // 새로운 예약을 생성하는 메소드
    @Override
    public void createNewAppointment(int workId, String trainerId, String customerId, LocalDateTime start) {
        if (isAvailable(workId, trainerId, customerId, start)) { // 예약 가능 여부 확인
            Appointment appointment = new Appointment();
            appointment.setStatus(AppointmentStatus.SCHEDULED); // 예약 상태 설정
            appointment.setCustomer(customerService.getCustomerById(customerId)); // 고객 설정
            appointment.setTrainer(trainerService.getTrainerById(trainerId)); // 트레이너 설정
            Work work = workService.getWorkById(workId); // 작업 정보 가져오기
            appointment.setWork(work);
            appointment.setStart(start); // 예약 시작 시간 설정
            appointment.setEnd(start.plusMinutes(work.getDuration())); // 예약 종료 시간 설정
            appointmentRepository.save(appointment); // 예약 저장
        } else {
            throw new RuntimeException("Appointment is not available."); // 예약 불가 시 예외 발생
        }
    }

    // 기존 예약을 업데이트하는 메소드
    @Override
    public void updateAppointment(Appointment appointment) {
        appointmentRepository.save(appointment); // 예약 정보 저장
    }

    // 예약 ID로 예약을 삭제하는 메소드
    @Override
    public void deleteAppointmentById(int id) {
        appointmentRepository.deleteById(id); // 예약 삭제
    }

    // 예약 ID로 예약 정보를 가져오는 메소드
    @Override
    public Appointment getAppointmentById(int id) {
        return appointmentRepository.findById(id)
                .orElseThrow(AppointmentNotFoundException::new); // 예약이 없으면 예외 발생
    }

    // 모든 예약 정보를 가져오는 메소드 (관리자 권한 필요)
    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll(); // 모든 예약 반환
    }

    // 특정 고객의 예약 목록을 가져오는 메소드
    @Override
    @PreAuthorize("#customerId == principal.id")
    public List<Appointment> getAppointmentByCustomerId(String customerId) {
        return appointmentRepository.findByCustomerId(customerId); // 고객의 예약 반환
    }

    // 특정 트레이너의 예약 목록을 가져오는 메소드
    @Override
    @PreAuthorize("#trainerId == principal.id")
    public List<Appointment> getAppointmentByTrainerId(String trainerId) {
        return appointmentRepository.findByTrainerId(trainerId); // 트레이너의 예약 반환
    }

    // 특정 날짜에 특정 트레이너와 고객의 사용 가능한 시간을 가져오는 메소드
    @Override
    public List<TimePeriod> getAvailableHours(String trainerId, String customerId, int workId, LocalDate date) {
        Trainer trainer = trainerService.getTrainerById(trainerId); // 트레이너 정보 가져오기
        WorkingPlan workingPlan = trainer.getWorkingPlan(); // 트레이너의 근무 계획 가져오기
        DayPlan selectedDay = workingPlan.getDay(date.getDayOfWeek().toString().toLowerCase()); // 해당 날짜의 근무 계획 가져오기

        // 트레이너와 고객의 예약 목록 가져오기
        List<Appointment> trainerAppointments = getAppointmentByTrainerId(trainerId);
        List<Appointment> customerAppointments = getAppointmentByCustomerId(customerId);

        // 사용 가능한 시간대 계산
        List<TimePeriod> availablePeriods = selectedDay.timePeriodsWithBreaksExcluded();
        availablePeriods = excludeAppointmentsFromTimePeriods(availablePeriods, trainerAppointments);
        availablePeriods = excludeAppointmentsFromTimePeriods(availablePeriods, customerAppointments);
        return calculateAvailableHours(availablePeriods, workService.getWorkById(workId)); // 최종 사용 가능한 시간대 반환
    }

    // 예약 가능 여부 확인
    @Override
    public boolean isAvailable(int workId, String trainerId, String customerId, LocalDateTime start) {
        if (!workService.isWorkForCustomer(workId, customerId)) {
            return false; // 고객에게 해당 작업이 유효하지 않음
        }
        Work work = workService.getWorkById(workId); // 작업 정보 가져오기
        TimePeriod timePeriod = new TimePeriod(start.toLocalTime(), start.toLocalTime().plusMinutes(work.getDuration())); // 예약 시간대 설정
        return getAvailableHours(trainerId, customerId, workId, start.toLocalDate()).contains(timePeriod); // 사용 가능한 시간대에서 확인
    }

    // 예약 가능 시간대 계산
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

    // 예약 시간대에서 기존 예약을 제외합니다.
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
}