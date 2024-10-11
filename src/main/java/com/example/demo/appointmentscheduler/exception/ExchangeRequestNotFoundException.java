package com.example.demo.appointmentscheduler.exception;

public class ExchangeRequestNotFoundException extends RuntimeException {
    // 기본 생성자
    public ExchangeRequestNotFoundException() {
        super("Exchange request not found");
    }

    // 메시지를 받는 생성자
    public ExchangeRequestNotFoundException(String message) {
        super(message);
    }
}