
  package com.example.demo.service;

  import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Review;
import com.example.demo.repository.ReviewRepository;
  
  @Service
  public class ReviewService {
  
      @Autowired
      private ReviewRepository reviewRepository;

      public List<Review> getAllReviews(){
        return reviewRepository.findAll();
      }
  
      // 리뷰 저장
      public Review saveReview(Review review) {
          // 별점 제한 (별점이 5를 넘지 않도록 설정)
          if (review.getStar() > 5) {
              review.setStar(5); // 별점이 5를 넘으면 5로 설정
          }
          return reviewRepository.save(review);
      }
  
      // 리뷰 ID로 리뷰 조회
      public Optional<Review> getReviewById(int rvNum) {
          return reviewRepository.findById(rvNum);
      }
  
      // 특정 상품에 대한 리뷰 가져오기
      public List<Review> getReviewsByProduct(int pNum) {
          return reviewRepository.findByProductPNum(pNum);
      }
  
      // 특정 유저가 남긴 리뷰 가져오기
      public List<Review> getReviewsByUser(String userId) {
          return reviewRepository.findByUserId(userId);
      }
  
      // 리뷰 삭제
      public void deleteReview(int rvNum) {
          reviewRepository.deleteById(rvNum);
      }
  
      // 리뷰 신고 (rvWarning 필드를 1로 설정)
      public Review reportReview(int rvNum) {
          Optional<Review> reviewOpt = reviewRepository.findById(rvNum);
          if (reviewOpt.isPresent()) {
              Review review = reviewOpt.get();
              review.setRvWarning(1); // 신고 상태로 변경
              return reviewRepository.save(review);
          }
          return null; // 리뷰가 없을 경우 null 반환
      }
  }
  

