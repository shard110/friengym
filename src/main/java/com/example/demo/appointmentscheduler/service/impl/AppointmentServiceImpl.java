package com.example.demo.appointmentscheduler.service.impl;

import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.example.demo.appointmentscheduler.entity.Appointment;
import com.example.demo.appointmentscheduler.repository.AppointmentRepository;
import com.example.demo.appointmentscheduler.service.WorkService;
import com.example.demo.service.UserService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

// AppointmentServiceImpl 클래스는 AppointmentService 인터페이스를 구현하며,
// 예약 관리 기능을 제공하는 서비스 클래스입니다.
@Service
public class AppointmentServiceImpl implements AppointmentService {

    // 한 달에 허용된 최대 취소 수
    private final int NUMBER_OF_ALLOWED_CANCELATIONS_PER_MONTH = 1;

    // 의존성 주입을 위한 리포지토리 및 서비스 필드
    private final AppointmentRepository appointmentRepository;
    private final WorkService workService;
    private final UserService userService;
    // private final ChatMessageRepository chatMessageRepository;
    // private final NotificationService notificationService;
    // private final JwtTokenServiceImpl jwtTokenService;

    // 생성자: 각 서비스와 리포지토리를 주입받아 초기화합니다.
    public AppointmentServiceImpl(AppointmentRepository appointmentRepository, UserService userService, WorkService workService, ChatMessageRepository chatMessageRepository, NotificationService notificationService, JwtTokenServiceImpl jwtTokenService) {
        this.appointmentRepository = appointmentRepository;
        this.userService = userService;
        this.workService = workService;
    //     this.chatMessageRepository = chatMessageRepository;
    //     this.notificationService = notificationService;
    //     this.jwtTokenService = jwtTokenService;
    // }

    // 예약 정보를 업데이트하는 메소드
    @Override
    public void updateAppointment(Appointment appointment) {
        appointmentRepository.save(appointment);
    }

    // 권한이 있는 경우 예약 정보를 가져오는 메소드
    @Override
    @PostAuthorize("returnObject.trainer.id == principal.id or returnObject.customer.id == principal.id or hasRole('ADMIN')")
    public Appointment getAppointmentByIdWithAuthorization(int id) {
        return getAppointmentById(id);
    }

    // 예약 ID로 예약 정보를 가져오는 메소드
    @Override
    public Appointment getAppointmentById(int id) {
        return appointmentRepository.findById(id)
                .orElseThrow(AppointmentNotFoundException::new);
    }

    // 관리자 권한으로 모든 예약을 가져오는 메소드
    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // 예약 ID로 예약을 삭제하는 메소드
    @Override
    public void deleteAppointmentById(int id) {
        appointmentRepository.deleteById(id);
    }

    // 특정 고객 ID로 예약 목록을 가져오는 메소드
    @Override
    @PreAuthorize("#customerId == principal.id")
    public List<Appointment> getAppointmentByCustomerId(int customerId) {
        return appointmentRepository.findByCustomerId(customerId);
    }

    // 특정 트레이너 ID로 예약 목록을 가져오는 메소드
    @Override
    @PreAuthorize("#trainerId == principal.id")
    public List<Appointment> getAppointmentByTrainerId(int trainerId) {
        return appointmentRepository.findByTrainerId(trainerId);
    }

    // 특정 트레이너와 날짜로 예약 목록을 가져오는 메소드
    @Override
    public List<Appointment> getAppointmentsByTrainerAtDay(int trainerId, LocalDate day) {
        return appointmentRepository.findByTrainerIdWithStartInPeriod(trainerId, day.atStartOfDay(), day.atStartOfDay().plusDays(1));
    }

    // 특정 고객과 날짜로 예약 목록을 가져오는 메소드
    @Override
    public List<Appointment> getAppointmentsByCustomerAtDay(int customerId, LocalDate day) {
        return appointmentRepository.findByCustomerIdWithStartInPeriod(customerId, day.atStartOfDay(), day.atStartOfDay().plusDays(1));
    }

    // 특정 날짜에 사용 가능한 시간을 가져오는 메소드
    @Override
    public List<TimePeroid> getAvailableHours(int trainerId, int customerId, int workId, LocalDate date) {
        // 트레이너의 근무 계획을 가져오고, 해당 날짜의 예약 목록을 조회합니다.
        Trainer trainer = userService.getTrainerById(trainerId);
        WorkingPlan workingPlan = trainer.getWorkingPlan();
        DayPlan selectedDay = workingPlan.getDay(date.getDayOfWeek().toString().toLowerCase());

        List<Appointment> trainerAppointments = getAppointmentsByTrainerAtDay(trainerId, date);
        List<Appointment> customerAppointments = getAppointmentsByCustomerAtDay(customerId, date);

        List<TimePeroid> availablePeriods = selectedDay.timePeriodsWithBreaksExcluded();
        availablePeriods = excludeAppointmentsFromTimePeriods(availablePeriods, trainerAppointments);
        availablePeriods = excludeAppointmentsFromTimePeriods(availablePeriods, customerAppointments);
        return calculateAvailableHours(availablePeriods, workService.getWorkById(workId));
    }

    // 새로운 예약을 생성하는 메소드
    @Override
    public void createNewAppointment(int workId, int trainerId, int customerId, LocalDateTime start) {
        if (isAvailable(workId, trainerId, customerId, start)) {
            Appointment appointment = new Appointment();
            appointment.setStatus(AppointmentStatus.SCHEDULED);
            appointment.setCustomer(userService.getCustomerById(customerId));
            appointment.setTrainer(userService.getTrainerById(trainerId));
            Work work = workService.getWorkById(workId);
            appointment.setWork(work);
            appointment.setStart(start);
            appointment.setEnd(start.plusMinutes(work.getDuration()));
            appointmentRepository.save(appointment);
            notificationService.newAppointmentScheduledNotification(appointment, true);
        } else {
            throw new RuntimeException("예약이 불가능합니다.");
        }
    }

    // 예약 목록에서 특정 시간대를 제외하는 메소드
    @Override
    public List<TimePeroid> excludeAppointmentsFromTimePeriods(List<TimePeroid> periods, List<Appointment> appointments) {
        List<TimePeroid> toAdd = new ArrayList<>();
        Collections.sort(appointments);
        for (Appointment appointment : appointments) {
            for (TimePeroid period : periods) {
                // 예약 시간과 겹치는 시간대를 조정합니다.
                if ((appointment.getStart().toLocalTime().isBefore(period.getStart()) || appointment.getStart().toLocalTime().equals(period.getStart())) 
                    && appointment.getEnd().toLocalTime().isAfter(period.getStart()) && appointment.getEnd().toLocalTime().isBefore(period.getEnd())) {
                    period.setStart(appointment.getEnd().toLocalTime());
                }
                if (appointment.getStart().toLocalTime().isAfter(period.getStart()) && appointment.getStart().toLocalTime().isBefore(period.getEnd()) 
                    && appointment.getEnd().toLocalTime().isAfter(period.getEnd()) || appointment.getEnd().toLocalTime().equals(period.getEnd())) {
                    period.setEnd(appointment.getStart().toLocalTime());
                }
                if (appointment.getStart().toLocalTime().isAfter(period.getStart()) && appointment.getEnd().toLocalTime().isBefore(period.getEnd())) {
                    toAdd.add(new TimePeroid(period.getStart(), appointment.getStart().toLocalTime()));
                    period.setStart(appointment.getEnd().toLocalTime());
                }
            }
        }
        periods.addAll(toAdd);
        Collections.sort(periods);
        return periods;
    }

    // 기타 메소드들에 대해서도 유사하게 주석을 추가합니다.
}
