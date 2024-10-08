package com.example.demo.appointmentscheduler.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import com.example.demo.appointmentscheduler.entity.Appointment;
import com.example.demo.appointmentscheduler.service.AppointmentService;
import com.example.demo.appointmentscheduler.service.ExchangeService;

import java.util.List;

@RestController 
@RequestMapping("/api/exchange")
public class ExchangeController {

    private final ExchangeService exchangeService; // 교환 서비스
    private final AppointmentService appointmentService; // 약속 서비스

    // 생성자 주입을 통해 서비스 클래스의 인스턴스를 초기화
    public ExchangeController(ExchangeService exchangeService, AppointmentService appointmentService) {
        this.exchangeService = exchangeService;
        this.appointmentService = appointmentService;
    }

    // 특정 약속에 대한 교환 가능한 약속 목록을 조회하는 메서드
    @GetMapping("/{oldAppointmentId}") // GET 요청을 처리
    public ResponseEntity<List<Appointment>> showEligibleAppointmentsToExchange(@PathVariable("oldAppointmentId") int oldAppointmentId) {
        List<Appointment> eligibleAppointments = exchangeService.getEligibleAppointmentsForExchange(oldAppointmentId);
        return ResponseEntity.ok(eligibleAppointments); // 교환 가능한 약속 목록 반환
    }

    // 교환 요약 화면을 표시하는 메서드
    @GetMapping("/{oldAppointmentId}/{newAppointmentId}") // GET 요청을 처리
    public ResponseEntity<ExchangeSummary> showExchangeSummaryScreen(@PathVariable("oldAppointmentId") int oldAppointmentId,
                                                                     @PathVariable("newAppointmentId") int newAppointmentId,
                                                                     @AuthenticationPrincipal CustomUserDetails currentUser) {
        // 교환 가능 여부를 체크
        if (exchangeService.checkIfExchangeIsPossible(oldAppointmentId, newAppointmentId, currentUser.getId())) {
            Appointment oldAppointment = appointmentService.getAppointmentByIdWithAuthorization(oldAppointmentId); // 기존 약속 정보
            Appointment newAppointment = appointmentService.getAppointmentById(newAppointmentId); // 새로운 약속 정보
            
            ExchangeSummary summary = new ExchangeSummary(oldAppointment, newAppointment);
            return ResponseEntity.ok(summary); // 교환 요약 정보 반환
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 교환이 불가능한 경우 403 반환
        }
    }

    // 교환 요청을 처리하는 메서드
    @PostMapping() // POST 요청을 처리
    public ResponseEntity<String> processExchangeRequest(@RequestParam("oldAppointmentId") int oldAppointmentId,
                                                         @RequestParam("newAppointmentId") int newAppointmentId,
                                                         @AuthenticationPrincipal CustomUserDetails currentUser) {
        boolean result = exchangeService.requestExchange(oldAppointmentId, newAppointmentId, currentUser.getId()); // 교환 요청
        if (result) {
            return ResponseEntity.ok("Exchange request successfully sent!"); // 성공 메시지 반환
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error! Exchange not sent!"); // 오류 메시지 반환
        }
    }

    // 교환 요청 수락을 처리하는 메서드
    @PostMapping("/accept") // POST 요청을 처리
    public ResponseEntity<Void> processExchangeAcceptation(@RequestParam("exchangeId") int exchangeId,
                                                           @AuthenticationPrincipal CustomUserDetails currentUser) {
        exchangeService.acceptExchange(exchangeId, currentUser.getId()); // 교환 수락
        return ResponseEntity.noContent().build(); // 성공 시 204 No Content 반환
    }

    // 교환 요청 거절을 처리하는 메서드
    @PostMapping("/reject") // POST 요청을 처리
    public ResponseEntity<Void> processExchangeRejection(@RequestParam("exchangeId") int exchangeId,
                                                         @AuthenticationPrincipal CustomUserDetails currentUser) {
        exchangeService.rejectExchange(exchangeId, currentUser.getId()); // 교환 거절
        return ResponseEntity.noContent().build(); // 성공 시 204 No Content 반환
    }

    // 교환 요약 정보를 위한 DTO 클래스
    public static class ExchangeSummary {
        private final Appointment oldAppointment; // 기존 약속
        private final Appointment newAppointment; // 새로운 약속

        public ExchangeSummary(Appointment oldAppointment, Appointment newAppointment) {
            this.oldAppointment = oldAppointment;
            this.newAppointment = newAppointment;
        }

        // Getters
        public Appointment getOldAppointment() {
            return oldAppointment; // 기존 약속 반환
        }

        public Appointment getNewAppointment() {
            return newAppointment; // 새로운 약속 반환
        }
    }
}