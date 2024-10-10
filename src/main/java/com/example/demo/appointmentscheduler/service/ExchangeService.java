package com.example.demo.appointmentscheduler.service;

import java.util.List;

import com.example.demo.appointmentscheduler.entity.Appointment;

public interface ExchangeService {

    boolean checkIfEligibleForExchange(String userId, int appointmentId);

    List<Appointment> getEligibleAppointmentsForExchange(int appointmentId);

    boolean checkIfExchangeIsPossible(int oldAppointmentId, int newAppointmentId, String userId);

    boolean acceptExchange(int exchangeId, String userId);

    boolean rejectExchange(int exchangeId, String userId);

    boolean requestExchange(int oldAppointmentId, int newAppointmentId, String userId);
}