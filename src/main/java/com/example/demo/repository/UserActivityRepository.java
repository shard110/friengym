package com.example.demo.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.User;
import com.example.demo.entity.UserActivity;

public interface UserActivityRepository extends JpaRepository<UserActivity,Long> {
  List<UserActivity> findByUser(User user);

  @Query("SELECT DISTINCT h.tag FROM UserActivity ua JOIN ua.post p JOIN p.hashtags h WHERE ua.user.id = :userId")
    Set<String> findHashtagsByUserId(@Param("userId") String userId);
}
