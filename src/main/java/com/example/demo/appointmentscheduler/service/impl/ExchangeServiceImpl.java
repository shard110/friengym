package com.example.demo.appointmentscheduler.service.impl;


import org.springframework.stereotype.Service;

import com.example.demo.appointmentscheduler.ExchangeRequestRepository;
import com.example.demo.appointmentscheduler.repository.AppointmentRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExchangeServiceImpl implements ExchangeService {

    private final AppointmentRepository appointmentRepository;
    // private final NotificationService notificationService;
    private final ExchangeRequestRepository exchangeRequestRepository;

    // 생성자
    public ExchangeServiceImpl(AppointmentRepository appointmentRepository, NotificationService notificationService, ExchangeRequestRepository exchangeRequestRepository) {
        this.appointmentRepository = appointmentRepository;
        this.notificationService = notificationService;
        this.exchangeRequestRepository = exchangeRequestRepository;
    }

    @Override
    // 사용자가 교환 요청을 할 자격이 있는지 확인하는 메소드
    public boolean checkIfEligibleForExchange(int userId, int appointmentId) {
        Appointment appointment = appointmentRepository.getOne(appointmentId);
        return appointment.getStart().minusHours(24).isAfter(LocalDateTime.now()) &&
               appointment.getStatus().equals(AppointmentStatus.SCHEDULED) &&
               appointment.getCustomer().getId() == userId;
    }

    @Override
    // 교환 가능 예약 목록을 가져오는 메소드
    public List<Appointment> getEligibleAppointmentsForExchange(int appointmentId) {
        Appointment appointmentToExchange = appointmentRepository.getOne(appointmentId);
        return appointmentRepository.getEligibleAppointmentsForExchange(LocalDateTime.now().plusHours(24), 
                appointmentToExchange.getCustomer().getId(), 
                appointmentToExchange.getTrainer().getId(), // provider를 trainer로 변경
                appointmentToExchange.getWork().getId());
    }

    @Override
    // 교환 가능 여부를 확인하는 메소드
    public boolean checkIfExchangeIsPossible(int oldAppointmentId, int newAppointmentId, int userId) {
        Appointment oldAppointment = appointmentRepository.getOne(oldAppointmentId);
        Appointment newAppointment = appointmentRepository.getOne(newAppointmentId);
        if (oldAppointment.getCustomer().getId() == userId) {
            return oldAppointment.getWork().getId().equals(newAppointment.getWork().getId()) &&
                   oldAppointment.getTrainer().getId().equals(newAppointment.getTrainer().getId()) && // provider를 trainer로 변경
                   oldAppointment.getStart().minusHours(24).isAfter(LocalDateTime.now()) &&
                   newAppointment.getStart().minusHours(24).isAfter(LocalDateTime.now());
        } else {
            throw new org.springframework.security.access.AccessDeniedException("Unauthorized");
        }
    }

    @Override
    // 교환 요청을 수락하는 메소드
    public boolean acceptExchange(int exchangeId, int userId) {
        ExchangeRequest exchangeRequest = exchangeRequestRepository.getOne(exchangeId);
        Appointment requestor = exchangeRequest.getRequestor();
        Appointment requested = exchangeRequest.getRequested();
        Customer tempCustomer = requestor.getCustomer();
        requestor.setStatus(AppointmentStatus.SCHEDULED);
        exchangeRequest.setStatus(ExchangeStatus.ACCEPTED);
        requestor.setCustomer(requested.getCustomer());
        requested.setCustomer(tempCustomer);
        exchangeRequestRepository.save(exchangeRequest);
        appointmentRepository.save(requested);
        appointmentRepository.save(requestor);
        notificationService.newExchangeAcceptedNotification(exchangeRequest, true);
        return true;
    }

    @Override
    // 교환 요청을 거부하는 메소드
    public boolean rejectExchange(int exchangeId, int userId) {
        ExchangeRequest exchangeRequest = exchangeRequestRepository.getOne(exchangeId);
        Appointment requestor = exchangeRequest.getRequestor();
        exchangeRequest.setStatus(ExchangeStatus.REJECTED);
        requestor.setStatus(AppointmentStatus.SCHEDULED);
        exchangeRequestRepository.save(exchangeRequest);
        appointmentRepository.save(requestor);
        notificationService.newExchangeRejectedNotification(exchangeRequest, true);
        return true;
    }

    @Override
    // 교환 요청을 만드는 메소드
    public boolean requestExchange(int oldAppointmentId, int newAppointmentId, int userId) {
        if (checkIfExchangeIsPossible(oldAppointmentId, newAppointmentId, userId)) {
            Appointment oldAppointment = appointmentRepository.getOne(oldAppointmentId);
            Appointment newAppointment = appointmentRepository.getOne(newAppointmentId);
            oldAppointment.setStatus(AppointmentStatus.EXCHANGE_REQUESTED);
            appointmentRepository.save(oldAppointment);
            ExchangeRequest exchangeRequest = new ExchangeRequest(oldAppointment, newAppointment, ExchangeStatus.PENDING);
            exchangeRequestRepository.save(exchangeRequest);
            notificationService.newExchangeRequestedNotification(oldAppointment, newAppointment, true);
            return true;
        }
        return false;
    }
}