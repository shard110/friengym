package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findById(String id);

    // 이름과 이메일로 사용자를 찾는 메소드 추가
    Optional<User> findByNameAndEmail(String name, String email);

    Optional<User> findByname(String name);
    Optional<User> findByEmail(String email);
}
