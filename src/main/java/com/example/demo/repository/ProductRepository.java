package com.example.demo.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Integer>{

  @Query("SELECT p FROM Product p WHERE p.category.catenum = ?1")
  List<Product> findByCategory(int catenum);

  // @Query("SELECT p FROM Product p WHERE p.pName LIKE %:keyword%")
  // List<Product> findByPNameContaining(@Param("keyword") String keyword);
  List<Product> findByPNameContaining(String keyword);
}
