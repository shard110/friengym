package com.example.demo.repository;

import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findById(String id);

    // 이름과 이메일로 사용자를 찾는 메소드
    Optional<User> findByNameAndEmail(String name, String email);

    // 이메일로 사용자를 찾는 메소드
    Optional<User> findUserByEmail(String userEmail);

    // 비밀번호 업데이트를 위한 메소드
    @Modifying
    @Query("UPDATE User u SET u.pwd = :password WHERE u.id = :id")
    void updateUserPassword(@Param("id") String id, @Param("password") String password);
}
