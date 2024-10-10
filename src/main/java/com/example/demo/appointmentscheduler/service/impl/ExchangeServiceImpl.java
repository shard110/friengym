package com.example.demo.appointmentscheduler.service.impl;


import org.springframework.stereotype.Service;

import com.example.demo.appointmentscheduler.ExchangeRequest;
import com.example.demo.appointmentscheduler.ExchangeStatus;

import com.example.demo.appointmentscheduler.entity.AppointmentStatus;
import com.example.demo.appointmentscheduler.entity.Customer;
import com.example.demo.appointmentscheduler.entity.Appointment; // Appointment import
import com.example.demo.appointmentscheduler.exception.AppointmentNotFoundException; // Exception import

import com.example.demo.appointmentscheduler.repository.AppointmentRepository;
import com.example.demo.appointmentscheduler.repository.ExchangeRequestRepository;
import com.example.demo.appointmentscheduler.service.ExchangeService;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExchangeServiceImpl implements ExchangeService {

    private final AppointmentRepository appointmentRepository;
    // private final NotificationService notificationService;
    private final ExchangeRequestRepository exchangeRequestRepository;

    // 생성자
    public ExchangeServiceImpl(AppointmentRepository appointmentRepository, ExchangeRequestRepository exchangeRequestRepository) {
        this.appointmentRepository = appointmentRepository;
        // this.notificationService = notificationService;
        this.exchangeRequestRepository = exchangeRequestRepository;
    }

    @Override
// 사용자가 교환 요청을 할 자격이 있는지 확인하는 메소드
public boolean checkIfEligibleForExchange(String userId, int appointmentId) {
    // findById 메서드를 사용하여 Appointment를 가져옴
    Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new AppointmentNotFoundException("Appointment not found"));

    // 교환 자격 확인 로직
    return appointment.getStart().minusHours(24).isAfter(LocalDateTime.now()) &&
           appointment.getStatus().equals(AppointmentStatus.SCHEDULED) &&
           appointment.getCustomer().getId().equals(userId); // equals로 변경
}

    @Override
    // 교환 가능 예약 목록을 가져오는 메소드
    public List<Appointment> getEligibleAppointmentsForExchange(int appointmentId) {
        Appointment appointmentToExchange = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException("Appointment not found"));

        return appointmentRepository.getEligibleAppointmentsForExchange(LocalDateTime.now().plusHours(24), 
                appointmentToExchange.getCustomer().getId(), 
                appointmentToExchange.getTrainer().getTrainerId(), 
                appointmentToExchange.getWork().getId());
    }



    @Override
    // 교환 요청을 수락하는 메소드
    public boolean acceptExchange(int exchangeId, String userId) {
        ExchangeRequest exchangeRequest = exchangeRequestRepository.findById(exchangeId)
                .orElseThrow(() -> new AppointmentNotFoundException("Exchange Request not found"));
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
        // notificationService.newExchangeAcceptedNotification(exchangeRequest, true); // 필요시 주석 해제
        return true;
    }

    @Override
    // 교환 요청을 거부하는 메소드
    public boolean rejectExchange(int exchangeId, String userId) {
        ExchangeRequest exchangeRequest = exchangeRequestRepository.findById(exchangeId)
                .orElseThrow(() -> new AppointmentNotFoundException("Exchange Request not found"));
        Appointment requestor = exchangeRequest.getRequestor();

        exchangeRequest.setStatus(ExchangeStatus.REJECTED);
        requestor.setStatus(AppointmentStatus.SCHEDULED);
        
        exchangeRequestRepository.save(exchangeRequest);
        appointmentRepository.save(requestor);
        // notificationService.newExchangeRejectedNotification(exchangeRequest, true); // 필요시 주석 해제
        return true;
    }

    @Override
    // 교환 요청을 만드는 메소드
    public boolean requestExchange(int oldAppointmentId, int newAppointmentId, String userId) {
        if (checkIfExchangeIsPossible(oldAppointmentId, newAppointmentId, userId)) {
            Appointment oldAppointment = appointmentRepository.findById(oldAppointmentId)
                    .orElseThrow(() -> new AppointmentNotFoundException("Old Appointment not found"));
            Appointment newAppointment = appointmentRepository.findById(newAppointmentId)
                    .orElseThrow(() -> new AppointmentNotFoundException("New Appointment not found"));
            
            oldAppointment.setStatus(AppointmentStatus.EXCHANGE_REQUESTED);
            appointmentRepository.save(oldAppointment);
            
            ExchangeRequest exchangeRequest = new ExchangeRequest(oldAppointment, newAppointment, ExchangeStatus.PENDING);
            exchangeRequestRepository.save(exchangeRequest);
            // notificationService.newExchangeRequestedNotification(oldAppointment, newAppointment, true); // 필요시 주석 해제
            return true;
        }
        return false;
    }

//☆
    @Override
    public boolean checkIfExchangeIsPossible(int oldAppointmentId, int newAppointmentId, String userId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'checkIfExchangeIsPossible'");
    }
}