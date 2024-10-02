package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findById(String id);

    Optional<User> findByname(String name);
    Optional<User> findByEmail(String email);
}
