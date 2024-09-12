package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Master;
import com.example.demo.repository.MasterRepository;

@Service
public class MasterService {

    @Autowired
    private MasterRepository masterRepository;

    public List<Master> getAllMasters() {
        return masterRepository.findAll();
    }

    // ID로 마스터를 가져오는 메서드
    public Master getMasterById(String mid) {
        Optional<Master> master = masterRepository.findById(mid);
        if (master.isPresent()) {
            return master.get();
        } else {
            // 존재 여부 예외
            throw new RuntimeException(mid+ "ID와 일치하는 관리자를 찾을 수 없습니다. ID를 확인해주세요.");
        }
    }

    // 마스터를 저장하거나 업데이트하는 메서드
    public Master saveOrUpdateMaster(Master master) {
        return masterRepository.save(master);
    }

    // ID로 마스터를 삭제하는 메서드
    public void deleteMaster(String mid) {
        Optional<Master> master = masterRepository.findById(mid);
        if (master.isPresent()) {
            masterRepository.deleteById(mid);
        } else {
            // 존재 여부 예외
            throw new RuntimeException(mid+ "ID와 일치하는 관리자를 찾을 수 없습니다. ID를 확인해주세요.");
        }
    }

    // ID로 검색하는 메서드
    public List<Master> searchByMid(String mid) {
        return masterRepository.findByMidContaining(mid);
    }

    // 패스워드로 검색하는 메서드
    public List<Master> searchByMpwd(String mpwd) {
        return masterRepository.findByMpwdContaining(mpwd);
    }

    // ID 또는 패스워드로 검색하는 메서드
    public List<Master> searchByMidOrMpwd(String keyword) {
        return masterRepository.findByMidOrMpwd(keyword);
    }

    // ID와 패스워드로 검색하는 메서드
    public List<Master> searchByMidAndMpwd(String mid, String mpwd) {
        return masterRepository.findByMidAndMpwd(mid, mpwd);
    }

    // 필수 필드 확인
    // private void validateMaster(Master master) {
    //     if (master.getMid() == null || master.getMid().trim().isEmpty()) {
    //         throw new IllegalArgumentException("관리자 ID가 공백입니다. ID를 작성해주세요!");
    //     }
    //     if (master.getMpwd() == null || master.getMpwd().trim().isEmpty()) {
    //         throw new IllegalArgumentException("관리자 비밀번호가 공백입니다. 비밀번호를 작성해주세요!");
    //     }
    // }
}