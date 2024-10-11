package com.example.demo.appointmentscheduler.exception;

public class AppointmentNotFoundException extends RuntimeException {
        // 기본 생성자
        public AppointmentNotFoundException() {
            super("Appointment not found");
        }
    
        // 메시지를 받는 생성자
        public AppointmentNotFoundException(String message) {
            super(message);
        }
        
}
