package com.example.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "user_activity")
public class UserActivity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY) // 고유한 기본 키
  private Long id; // UserActivity의 고유 ID는 Long으로 설정

  @ManyToOne
  private User user; // User 엔티티의 ID는 String일 수 있음

  @ManyToOne
  private Post post;

  private LocalDateTime viewedAt;

  // 기본 생성자 추가
  public UserActivity() {}

  // 생성자
  public UserActivity(User user, Post post) {
      this.user = user;
      this.post = post;
      this.viewedAt = LocalDateTime.now();
  }
}
