package com.example.demo.appointmentscheduler.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.appointmentscheduler.entity.Appointment;
import com.example.demo.appointmentscheduler.service.AppointmentService;
import com.example.demo.appointmentscheduler.service.ExchangeService;
import com.example.demo.appointmentscheduler.service.WorkService;
import com.example.demo.appointmentscheduler.service.CustomerService;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments") 
public class AppointmentController {

    private final WorkService workService;
    private final CustomerService customerService;
    private final AppointmentService appointmentService;
    private final ExchangeService exchangeService;

    // 생성자 주입을 통해 서비스 클래스의 인스턴스를 초기화
    public AppointmentController(WorkService workService, CustomerService customerService, 
                                 AppointmentService appointmentService, ExchangeService exchangeService) {
        this.workService = workService;
        this.customerService = customerService;
        this.appointmentService = appointmentService;
        this.exchangeService = exchangeService;
    }

    // 모든 약속을 조회하는 메서드
    @GetMapping("/all") // GET 요청을 처리
    public ResponseEntity<List<Appointment>> getAllAppointments(@RequestParam("customerId") String customerId) {
        List<Appointment> appointments = appointmentService.getAppointmentByCustomerId(customerId);
        return ResponseEntity.ok(appointments); // 성공적으로 약속 목록을 반환
    }

// 특정 약속의 세부 정보를 조회하는 메서드
@GetMapping("/{id}") // GET 요청을 처리
public ResponseEntity<Appointment> getAppointmentDetail(@PathVariable("id") int appointmentId, 
                                                         @RequestParam("customerId") String customerId) {
    Appointment appointment = appointmentService.getAppointmentByIdWithAuthorization(appointmentId, customerId);
    return ResponseEntity.ok(appointment); // 약속 세부 정보를 반환
}

    // 약속 거절 요청을 처리하는 메서드
    @PostMapping("/reject") // POST 요청을 처리
    public ResponseEntity<Void> rejectAppointment(@RequestParam("appointmentId") int appointmentId, 
                                                  @RequestParam("customerId") String customerId) {
        boolean result = appointmentService.requestAppointmentRejection(appointmentId, customerId);
        return result ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build(); // 성공 또는 실패 응답 반환
    }

    // 약속 거절 수락 요청을 처리하는 메서드
    @PostMapping("/acceptRejection") // POST 요청을 처리
    public ResponseEntity<Void> acceptRejection(@RequestParam("appointmentId") int appointmentId, 
                                                 @RequestParam("customerId") String customerId) {
        boolean result = appointmentService.acceptRejection(appointmentId, customerId);
        return result ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build(); // 성공 또는 실패 응답 반환
    }

    // 약속을 예약하는 메서드
    @PostMapping("/new") // POST 요청을 처리
    public ResponseEntity<Void> bookAppointment(@RequestParam("workId") int workId, 
                                                 @RequestParam("trainerId") String trainerId, 
                                                 @RequestParam("start") String start, 
                                                 @RequestParam("customerId") String customerId) {
        appointmentService.createNewAppointment(workId, trainerId, customerId, LocalDateTime.parse(start));
        return ResponseEntity.ok().build(); // 성공적으로 예약한 경우
    }

    // 약속을 취소하는 메서드
    @PostMapping("/cancel") // POST 요청을 처리
    public ResponseEntity<Void> cancelAppointment(@RequestParam("appointmentId") int appointmentId, 
                                                  @RequestParam("customerId") String customerId) {
        appointmentService.cancelUserAppointmentById(appointmentId, customerId);
        return ResponseEntity.ok().build(); // 성공적으로 취소한 경우
    }
}