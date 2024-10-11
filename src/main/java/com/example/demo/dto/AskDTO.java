package com.example.demo.dto;
import java.sql.Timestamp;  // Timestamp를 import


public class AskDTO {
  private int anum;
  private String aTitle;
  private String aContents;
  private String afile;
  private Timestamp aDate;
  private String userId;  // User의 아이디만 반환

  // 기본 생성자
  public AskDTO() {}

  // 필요한 필드에 대한 생성자
  public AskDTO(int anum, String aTitle, String aContents, String afile, Timestamp aDate, String userId) {
      this.anum = anum;
      this.aTitle = aTitle;
      this.aContents = aContents;
      this.afile = afile;
      this.aDate = aDate;
      this.userId = userId;
  }

  // Getter와 Setter
  public int getAnum() {
      return anum;
  }

  public void setAnum(int anum) {
      this.anum = anum;
  }

  public String getaTitle() {
      return aTitle;
  }

  public void setaTitle(String aTitle) {
      this.aTitle = aTitle;
  }

  public String getaContents() {
      return aContents;
  }

  public void setaContents(String aContents) {
      this.aContents = aContents;
  }

  public String getAfile() {
      return afile;
  }

  public void setAfile(String afile) {
      this.afile = afile;
  }

  public Timestamp getaDate() {
      return aDate;
  }

  public void setaDate(Timestamp aDate) {
      this.aDate = aDate;
  }

  public String getUserId() {
      return userId;
  }

  public void setUserId(String userId) {
      this.userId = userId;
  }




}
