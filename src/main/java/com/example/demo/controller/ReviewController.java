package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Review;
import com.example.demo.service.ReviewService;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    // 리뷰 저장
    @PostMapping
    public Review saveReview(@RequestBody Review review) {
        return reviewService.saveReview(review);
    }

    // 리뷰 조회
    @GetMapping("/{rvNum}")
    public Optional<Review> getReviewById(@PathVariable int rvNum) {
        return reviewService.getReviewById(rvNum);
    }

    // 특정 상품에 대한 리뷰 조회
    @GetMapping("/product/{pNum}")
    public List<Review> getReviewsByProduct(@PathVariable int pNum) {
        return reviewService.getReviewsByProduct(pNum);
    }

    // 특정 유저가 남긴 리뷰 조회
    @GetMapping("/user/{userId}")
    public List<Review> getReviewsByUser(@PathVariable String userId) {
        return reviewService.getReviewsByUser(userId);
    }

    // 리뷰 신고
    @PutMapping("/report/{rvNum}")
    public Review reportReview(@PathVariable int rvNum) {
        return reviewService.reportReview(rvNum);
    }

    // 리뷰 삭제
    @DeleteMapping("/{rvNum}")
    public void deleteReview(@PathVariable int rvNum) {
        reviewService.deleteReview(rvNum);
    }
}
