package com.example.demo.appointmentscheduler.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.appointmentscheduler.entity.Trainer;
import com.example.demo.appointmentscheduler.service.TrainerService;

import java.util.List;

@RestController
@RequestMapping("/api/trainers") // API 경로를 'trainers'로 설정
@CrossOrigin("http://localhost:3000") // CORS 설정
public class TrainerController {

    @Autowired
    private TrainerService trainerService; // 트레이너 서비스 주입

    // 모든 트레이너 정보를 가져오는 메서드
    @GetMapping
    public List<Trainer> getAllTrainers() {
        return trainerService.getAllTrainers(); // 모든 트레이너 정보 반환
    }

    // 특정 트레이너 ID로 트레이너 정보를 가져오는 메서드
    @GetMapping("/{trainerId}") // 경로 변수 'trainerId'로 변경
    public Trainer getTrainerById(@PathVariable(value="trainerId") String trainerId) {
        return trainerService.getTrainerById(trainerId); // 특정 트레이너 정보 반환
    }

    // 새로운 트레이너를 생성하는 메서드
    @PostMapping
    public Trainer createTrainer(@RequestBody Trainer trainer) {
        return trainerService.saveOrUpdateTrainer(trainer); // 트레이너 정보 저장 또는 업데이트
    }

    // 특정 트레이너 정보를 업데이트하는 메서드
    @PutMapping("/{trainerId}") // 경로 변수 'trainerId'로 변경
    public Trainer updateTrainer(@PathVariable(value="trainerId") String trainerId, @RequestBody Trainer trainer) {
        trainer.setTrainerId(trainerId); // 전달받은 ID로 트레이너 ID 설정
        return trainerService.saveOrUpdateTrainer(trainer); // 트레이너 정보 저장 또는 업데이트
    }

    // 특정 트레이너를 삭제하는 메서드
    @DeleteMapping("/{trainerId}") // 경로 변수 'trainerId'로 변경
    public void deleteTrainer(@PathVariable(value="trainerId") String trainerId) {
        trainerService.deleteTrainer(trainerId); // 트레이너 삭제
    }

    // 트레이너 검색을 위한 메서드
    @GetMapping("/search")
    public List<Trainer> searchTrainers(
            @RequestParam(value="trainerId", required=false) String trainerId, // 요청 파라미터 'trainerId'
            @RequestParam(value="tpwd", required=false) String tpwd, // 요청 파라미터 'tpwd'
            @RequestParam(value="keyword", required=false) String keyword, // 요청 파라미터 'keyword'
            @RequestParam(value="type", required=false) String type) { // 요청 파라미터 'type'

        // 콘솔 로그 추가
        System.out.println("Search Type: " + type); 
        System.out.println("Keyword: " + keyword); 
        System.out.println("Trainer ID: " + trainerId); // trainerId 로그
        System.out.println("Trainer Password: " + tpwd); // 비밀번호 로그

        if (type != null) {
            switch (type) {
                case "trainerId":
                    return trainerService.searchByTrainerId(keyword); // 트레이너 ID로 검색
                case "tpwd":
                    return trainerService.searchByTpwd(keyword); // 비밀번호로 검색
                case "or":
                    return trainerService.searchByTrainerIdOrTpwd(keyword); // 트레이너 ID 또는 비밀번호로 검색
                case "and":
                    return trainerService.searchByTrainerIdAndTpwd(trainerId, tpwd); // 트레이너 ID와 비밀번호로 검색
                default:
                    return trainerService.getAllTrainers(); // 기본적으로 모든 트레이너 반환
            }
        } else {
            return trainerService.getAllTrainers(); // 타입이 null인 경우 모든 트레이너 반환
        }
    }
}