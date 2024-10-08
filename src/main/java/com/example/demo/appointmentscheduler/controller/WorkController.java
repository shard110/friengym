package com.example.appointmentscheduler.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.appointmentscheduler.Work;
import com.example.appointmentscheduler.service.WorkService;


import java.util.List;

@RestController // RESTful API 컨트롤러로 설정
@RequestMapping("/api/works") // '/api/works' 경로로 요청을 처리
public class WorkController {

    private final WorkService workService; // 작업 서비스

    // 생성자 주입을 통해 서비스 클래스의 인스턴스를 초기화
    public WorkController(WorkService workService) {
        this.workService = workService;
    }

    // 모든 작업을 조회하는 메서드
    @GetMapping("/all") // GET 요청을 처리
    public ResponseEntity<List<Work>> showAllWorks() {
        List<Work> works = workService.getAllWorks();
        return ResponseEntity.ok(works); // 작업 목록 반환
    }

    // 특정 작업의 세부 정보를 조회하는 메서드
    @GetMapping("/{workId}") // GET 요청을 처리
    public ResponseEntity<Work> showWorkDetails(@PathVariable("workId") int workId) {
        Work work = workService.getWorkById(workId);
        if (work != null) {
            return ResponseEntity.ok(work); // 작업 세부 정보 반환
        } else {
            return ResponseEntity.notFound().build(); // 작업을 찾을 수 없는 경우 404 반환
        }
    }

    // 새로운 작업을 추가하는 메서드
    @PostMapping() // POST 요청을 처리
    public ResponseEntity<Work> saveWork(@RequestBody Work work) {
        if (work.getId() != null) {
            workService.updateWork(work); // 기존 작업 업데이트
        } else {
            workService.createNewWork(work); // 새로운 작업 생성
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(work); // 생성된 작업 반환
    }

    // 특정 작업을 삭제하는 메서드
    @DeleteMapping("/{workId}") // DELETE 요청을 처리
    public ResponseEntity<Void> deleteWork(@PathVariable("workId") int workId) {
        workService.deleteWorkById(workId);
        return ResponseEntity.noContent().build(); // 성공 시 204 No Content 반환
    }
}