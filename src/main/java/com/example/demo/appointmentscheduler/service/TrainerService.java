package com.example.demo.appointmentscheduler.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.appointmentscheduler.entity.Trainer;
import com.example.demo.appointmentscheduler.repository.TrainerRepository;





@Service
public class TrainerService { 
    @Autowired
    private TrainerRepository trainerRepository;

    public List<Trainer> getAllTrainers() { 
        return trainerRepository.findAll();
    }

    // ID로 트레이너를 가져오는 메서드
    public Trainer getTrainerById(String trainerId) {
        Optional<Trainer> trainer = trainerRepository.findById(trainerId);
        if (trainer.isPresent()) {
            return trainer.get();
        } else {
            // 존재 여부 예외
            throw new RuntimeException(trainerId + " ID와 일치하는 트레이너를 찾을 수 없습니다. ID를 확인해주세요.");
        }
    }

    // 트레이너를 저장하거나 업데이트하는 메서드
    public Trainer saveOrUpdateTrainer(Trainer trainer) {
        return trainerRepository.save(trainer);
    }

    // ID로 트레이너를 삭제하는 메서드
    public void deleteTrainer(String trainerId) {
        Optional<Trainer> trainer = trainerRepository.findById(trainerId); 
        if (trainer.isPresent()) { // if 블록 추가
            trainerRepository.deleteById(trainerId);
        } else {
            // 존재 여부 예외
            throw new RuntimeException(trainerId + " ID와 일치하는 트레이너를 찾을 수 없습니다. ID를 확인해주세요.");
        }
    }

    // ID로 검색하는 메서드
    public List<Trainer> searchByTrainerId(String trainerId) { 
        return trainerRepository.findByTrainerIdContaining(trainerId); 
    }

    // 패스워드로 검색하는 메서드
    public List<Trainer> searchByTpwd(String tpwd) { 
        return trainerRepository.findByTpwdContaining(tpwd); 
    }

    // ID 또는 패스워드로 검색하는 메서드
    public List<Trainer> searchByTrainerIdOrTpwd(String keyword) {
        return trainerRepository.findByTrainerIdOrTpwd(keyword);
    }

    // ID와 패스워드로 검색하는 메서드
    public List<Trainer> searchByTrainerIdAndTpwd(String trainerId, String tpwd) { 
        return trainerRepository.findByTrainerIdAndTpwd(trainerId, tpwd);
    }

    // 필수 필드 확인 메서드
    // private void validateTrainer(Trainer trainer) {
    //     if (trainer.getTrainerId() == null || trainer.getTrainerId().trim().isEmpty()) {
    //         throw new IllegalArgumentException("트레이너 ID가 공백입니다. ID를 작성해주세요!");
    //     }
    //     if (trainer.getTpwd() == null || trainer.getTpwd().trim().isEmpty()) {
    //         throw new IllegalArgumentException("트레이너 비밀번호가 공백입니다. 비밀번호를 작성해주세요!");
    //     }
    // }
}