package com.example.demo.appointmentscheduler.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.appointmentscheduler.service.AppointmentService;
import com.example.demo.appointmentscheduler.service.ExchangeService;
import com.example.demo.appointmentscheduler.service.WorkService;

@RestController
@RequestMapping("/api/appointments") 
public class AppointmentController {

    private final WorkService workService;
    private final UserService userService;
    private final AppointmentService appointmentService;
    private final ExchangeService exchangeService;

    // 생성자 주입을 통해 서비스 클래스의 인스턴스를 초기화
    public AppointmentController(WorkService workService, UserService userService, 
                                 AppointmentService appointmentService, ExchangeService exchangeService) {
        this.workService = workService;
        this.userService = userService;
        this.appointmentService = appointmentService;
        this.exchangeService = exchangeService;
    }

    // 모든 약속을 조회하는 메서드
    @GetMapping("/all") // GET 요청을 처리
    public ResponseEntity<List<Appointment>> getAllAppointments(@AuthenticationPrincipal CustomUserDetails currentUser) {
        List<Appointment> appointments;
        
        // 사용자 역할에 따라 약속 목록을 다르게 가져옴
        if (currentUser.hasRole("ROLE_CUSTOMER")) {
            appointments = appointmentService.getAppointmentByCustomerId(currentUser.getId());
        } else if (currentUser.hasRole("ROLE_TRAINER")) {
            appointments = appointmentService.getAppointmentByTrainerId(currentUser.getId());
        } else if (currentUser.hasRole("ROLE_ADMIN")) {
            appointments = appointmentService.getAllAppointments();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 권한이 없는 경우
        }
        return ResponseEntity.ok(appointments); // 성공적으로 약속 목록을 반환
    }

    // 특정 약속의 세부 정보를 조회하는 메서드
    @GetMapping("/{id}") // GET 요청을 처리
    public ResponseEntity<Appointment> getAppointmentDetail(@PathVariable("id") int appointmentId, 
                                                             @AuthenticationPrincipal CustomUserDetails currentUser) {
        Appointment appointment = appointmentService.getAppointmentByIdWithAuthorization(appointmentId);
        return ResponseEntity.ok(appointment); // 약속 세부 정보를 반환
    }

    // 약속 거절 요청을 처리하는 메서드
    @PostMapping("/reject") // POST 요청을 처리
    public ResponseEntity<Void> rejectAppointment(@RequestParam("appointmentId") int appointmentId, 
                                                  @AuthenticationPrincipal CustomUserDetails currentUser) {
        boolean result = appointmentService.requestAppointmentRejection(appointmentId, currentUser.getId());
        return result ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build(); // 성공 또는 실패 응답 반환
    }

    // 약속 거절 수락 요청을 처리하는 메서드
    @PostMapping("/acceptRejection") // POST 요청을 처리
    public ResponseEntity<Void> acceptRejection(@RequestParam("appointmentId") int appointmentId, 
                                                 @AuthenticationPrincipal CustomUserDetails currentUser) {
        boolean result = appointmentService.acceptRejection(appointmentId, currentUser.getId());
        return result ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build(); // 성공 또는 실패 응답 반환
    }

    // 새 채팅 메시지를 추가하는 메서드
    @PostMapping("/messages/new") // POST 요청을 처리
    public ResponseEntity<Void> addChatMessage(@RequestBody ChatMessage chatMessage, 
                                                @RequestParam("appointmentId") int appointmentId, 
                                                @AuthenticationPrincipal CustomUserDetails currentUser) {
        int authorId = currentUser.getId();
        appointmentService.addMessageToAppointmentChat(appointmentId, authorId, chatMessage);
        return ResponseEntity.ok().build(); // 성공적으로 메시지를 추가한 경우
    }

    // 약속을 예약하는 메서드
    @PostMapping("/new") // POST 요청을 처리
    public ResponseEntity<Void> bookAppointment(@RequestParam("workId") int workId, 
                                                 @RequestParam("trainerId") int trainerId, 
                                                 @RequestParam("start") String start, 
                                                 @AuthenticationPrincipal CustomUserDetails currentUser) {
        appointmentService.createNewAppointment(workId, trainerId, currentUser.getId(), LocalDateTime.parse(start));
        return ResponseEntity.ok().build(); // 성공적으로 예약한 경우
    }

    // 약속을 취소하는 메서드
    @PostMapping("/cancel") // POST 요청을 처리
    public ResponseEntity<Void> cancelAppointment(@RequestParam("appointmentId") int appointmentId, 
                                                  @AuthenticationPrincipal CustomUserDetails currentUser) {
        appointmentService.cancelUserAppointmentById(appointmentId, currentUser.getId());
        return ResponseEntity.ok().build(); // 성공적으로 취소한 경우
    }
}
