package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Dorder;

public interface DorderRepository extends JpaRepository<Dorder, Integer> {
}

