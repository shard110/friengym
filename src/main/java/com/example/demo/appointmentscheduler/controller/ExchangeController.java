package com.example.demo.appointmentscheduler.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import com.example.demo.appointmentscheduler.entity.Appointment;
import com.example.demo.appointmentscheduler.entity.Customer;
import com.example.demo.appointmentscheduler.service.AppointmentService;
import com.example.demo.appointmentscheduler.service.ExchangeService;

import java.util.List;

@RestController
@RequestMapping("/api/exchange") // 교환 관련 API 엔드포인트
public class ExchangeController {

    private final ExchangeService exchangeService; // 교환 관련 서비스
    private final AppointmentService appointmentService; // 약속 관련 서비스

    // 생성자 주입을 통해 서비스 클래스를 초기화
    public ExchangeController(ExchangeService exchangeService, AppointmentService appointmentService) {
        this.exchangeService = exchangeService;
        this.appointmentService = appointmentService;
    }

    // 특정 약속에 대한 교환 가능한 약속 목록을 조회하는 메서드
    @GetMapping("/{oldAppointmentId}")
    public ResponseEntity<List<Appointment>> showEligibleAppointmentsToExchange(@PathVariable int oldAppointmentId) {
        List<Appointment> eligibleAppointments = exchangeService.getEligibleAppointmentsForExchange(oldAppointmentId);
        return ResponseEntity.ok(eligibleAppointments); // 교환 가능한 약속 목록 반환
    }

// 교환 요약 화면을 표시하는 메서드
@GetMapping("/{oldAppointmentId}/{newAppointmentId}")
public ResponseEntity<ExchangeSummary> showExchangeSummaryScreen(@PathVariable int oldAppointmentId,
                                                                 @PathVariable int newAppointmentId,
                                                                 @AuthenticationPrincipal Customer currentCustomer) {
    // 교환 가능 여부를 체크
    if (exchangeService.checkIfExchangeIsPossible(oldAppointmentId, newAppointmentId, currentCustomer.getId())) {
        // 기존 약속 정보 조회
        Appointment oldAppointment = appointmentService.getAppointmentByIdWithAuthorization(oldAppointmentId, currentCustomer.getId()); // customerId 추가
        Appointment newAppointment = appointmentService.getAppointmentById(newAppointmentId); // 새로운 약속 정보
        
        ExchangeSummary summary = new ExchangeSummary(oldAppointment, newAppointment); // 교환 요약 정보 생성
        return ResponseEntity.ok(summary); // 교환 요약 정보 반환
    } else {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 교환이 불가능한 경우 403 반환
    }
}

 // 교환 요청을 처리하는 메서드
@PostMapping()
public ResponseEntity<String> processExchangeRequest(@RequestParam int oldAppointmentId,
                                                     @RequestParam int newAppointmentId,
                                                     @AuthenticationPrincipal Customer currentCustomer) {
    // 교환 요청
    boolean result = exchangeService.requestExchange(oldAppointmentId, newAppointmentId, currentCustomer.getId()); 
    // 성공 또는 오류 메시지 반환
    return result 
        ? ResponseEntity.ok("Exchange request successfully sent!") 
        : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error! Exchange not sent!");
}

// 교환 요청 수락을 처리하는 메서드
@PostMapping("/accept")
public ResponseEntity<Void> processExchangeAcceptation(@RequestParam int exchangeId,
                                                       @AuthenticationPrincipal Customer currentCustomer) {
    // 교환 수락
    exchangeService.acceptExchange(exchangeId, currentCustomer.getId()); 
    return ResponseEntity.noContent().build(); // 성공 시 204 No Content 반환
}

// 교환 요청 거절을 처리하는 메서드
@PostMapping("/reject")
public ResponseEntity<Void> processExchangeRejection(@RequestParam int exchangeId,
                                                     @AuthenticationPrincipal Customer currentCustomer) {
    // 교환 거절
    exchangeService.rejectExchange(exchangeId, currentCustomer.getId()); 
    return ResponseEntity.noContent().build(); // 성공 시 204 No Content 반환
}

    // 교환 요약 정보를 위한 DTO 클래스
    public static class ExchangeSummary {
        private final Appointment oldAppointment; // 기존 약속
        private final Appointment newAppointment; // 새로운 약속

        // 생성자
        public ExchangeSummary(Appointment oldAppointment, Appointment newAppointment) {
            this.oldAppointment = oldAppointment; // 기존 약속 설정
            this.newAppointment = newAppointment; // 새로운 약속 설정
        }

        // 기존 약속 반환
        public Appointment getOldAppointment() {
            return oldAppointment;
        }

        // 새로운 약속 반환
        public Appointment getNewAppointment() {
            return newAppointment;
        }
    }
}