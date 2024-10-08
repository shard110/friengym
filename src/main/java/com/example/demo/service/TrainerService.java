package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Trainer; 
import com.example.demo.repository.TrainerRepository; 

@Service
public class TrainerService { 
    @Autowired
    private TrainerRepository trainerRepository;

    public List<Trainer> getAllTrainers() { 
        return trainerRepository.findAll();
    }

    // ID로 트레이너를 가져오는 메서드
    public Trainer getTrainerById(String tid) {
        Optional<Trainer> trainer = trainerRepository.findById(tid);
        if (trainer.isPresent()) {
            return trainer.get();
        } else {
            // 존재 여부 예외
            throw new RuntimeException(tid + " ID와 일치하는 트레이너를 찾을 수 없습니다. ID를 확인해주세요.");
        }
    }

    // 트레이너를 저장하거나 업데이트하는 메서드
    public Trainer saveOrUpdateTrainer(Trainer trainer) {
        return trainerRepository.save(trainer);
    }

    // ID로 트레이너를 삭제하는 메서드
    public void deleteTrainer(String tid) {
        Optional<Trainer> trainer = trainerRepository.findById(tid); 
        if (trainer.isPresent()) { // if 블록 추가
            trainerRepository.deleteById(tid);
        } else {
            // 존재 여부 예외
            throw new RuntimeException(tid + " ID와 일치하는 트레이너를 찾을 수 없습니다. ID를 확인해주세요.");
        }
    }

    // ID로 검색하는 메서드
    public List<Trainer> searchByTid(String tid) { 
        return trainerRepository.findByTidContaining(tid); 
    }

    // 패스워드로 검색하는 메서드
    public List<Trainer> searchByTpwd(String tpwd) { 
        return trainerRepository.findByTpwdContaining(tpwd); 
    }

    // ID 또는 패스워드로 검색하는 메서드
    public List<Trainer> searchByTidOrTpwd(String keyword) {
        return trainerRepository.findByTidOrTpwd(keyword);
    }

    // ID와 패스워드로 검색하는 메서드
    public List<Trainer> searchByTidAndTpwd(String tid, String tpwd) { 
        return trainerRepository.findByTidAndTpwd(tid, tpwd);
    }

    // 필수 필드 확인 메서드
    // private void validateTrainer(Trainer trainer) {
    //     if (trainer.getTid() == null || trainer.getTid().trim().isEmpty()) {
    //         throw new IllegalArgumentException("트레이너 ID가 공백입니다. ID를 작성해주세요!");
    //     }
    //     if (trainer.getTpwd() == null || trainer.getTpwd().trim().isEmpty()) {
    //         throw new IllegalArgumentException("트레이너 비밀번호가 공백입니다. 비밀번호를 작성해주세요!");
    //     }
    // }
}