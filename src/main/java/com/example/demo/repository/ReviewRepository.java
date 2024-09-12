package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Integer>{

   // 상품에 대한 리뷰를 가져오는 메서드 (pnum에 해당하는 리뷰 목록)
   List<Review> findByProductPNum(int pNum);

   // 유저에 대한 리뷰를 가져오는 메서드 (id에 해당하는 유저가 남긴 리뷰 목록)
   List<Review> findByUserId(String id);

}
