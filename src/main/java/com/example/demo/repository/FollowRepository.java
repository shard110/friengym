package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.Follow;
import com.example.demo.entity.User;


public interface FollowRepository extends JpaRepository<Follow, Long> {
  List<Follow> findByFollower(User follower);
  List<Follow> findByFollowing(User following);
  Optional<Follow> findByFollowerAndFollowing(User follower, User following);
 
  // 팔로우 관계 삭제 쿼리
  @Modifying
  @Transactional
  @Query("DELETE FROM Follow f WHERE f.follower = :follower AND f.following = :following")
  void deleteByFollowerAndFollowing(User follower, User following);

    @Query("SELECT COUNT(f) > 0 FROM Follow f WHERE f.follower.id = :otherUserId AND f.following.id = :currentUserId")
    boolean isFollowingMe(@Param("otherUserId") String otherUserId, @Param("currentUserId") String currentUserId);

}