package com.example.demo.entity;



import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@Entity
@Table(name = "ask")  // 데이터베이스 테이블 이름이 'ask'인 경우 사용
public class Ask {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)  // 자동 증가 설정
  private int anum;

  private String aTitle; // 제목
  private String aContents; // 내용

  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
  private Timestamp aDate;
  private String afile;
  private String passwordHash; // 비밀번호 해시값

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // 외래키 컬럼 이름
    private User user; // 작성자 (User 엔티티와 연결)

    private boolean isUpdated; // 수정 여부를 나타내는 필드

}
