package com.example.demo.dto;
import java.sql.Timestamp;  // Timestamp를 import

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AskDTO {
  private int anum;
  private String aTitle;
  private String aContents;
  private String afile;
  private Timestamp aDate;
  private String userId;  // User의 아이디만 반환
  private String passwordHash;
  private String reply;

  // 기본 생성자
  public AskDTO() {}

  // 필요한 필드에 대한 생성자
  public AskDTO(int anum, String aTitle, String aContents, String afile, Timestamp aDate, String userId, String passwordHash, String reply) {
      this.anum = anum;
      this.aTitle = aTitle;
      this.aContents = aContents;
      this.afile = afile;
      this.aDate = aDate;
      this.userId = userId;
      this.passwordHash = passwordHash;
      this.reply = reply;
  }
  
}