package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Follow;
import com.example.demo.entity.User;


public interface FollowRepository extends JpaRepository<Follow, Long> {
  List<Follow> findByFollower(User follower);
  List<Follow> findByFollowing(User following);
  Optional<Follow> findByFollowerAndFollowing(User follower, User following);
}