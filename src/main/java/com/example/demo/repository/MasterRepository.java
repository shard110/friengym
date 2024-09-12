package com.example.demo.repository;

import com.example.demo.entity.Master;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface MasterRepository extends JpaRepository<Master, String> {
    // Master는 엔티티 클래스, String은 그 엔티티의 기본 키 타입
    // JpaRepository를 확장하면 기본 CRUD 메서드를 자동으로 제공받습니다.
    // 필요에 따라 사용자 정의 쿼리 메서드를 추가할 수 있습니다.

    List<Master> findByMidContaining(String mid);
    List<Master> findByMpwdContaining(String mpwd);

    @Query("SELECT m FROM Master m WHERE m.mid LIKE %:keyword% OR m.mpwd LIKE %:keyword%")
    List<Master> findByMidOrMpwd(@Param("keyword") String keyword);

    @Query("SELECT m FROM Master m WHERE m.mid LIKE %:mid% AND m.mpwd LIKE %:mpwd%")
    List<Master> findByMidAndMpwd(@Param("mid") String mid, @Param("mpwd") String mpwd);
}
