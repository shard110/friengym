package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Ordertbl;

public interface OrderRepository extends JpaRepository<Ordertbl, Integer> {
    List<Ordertbl> findById(String id);
}