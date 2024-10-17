package com.example.demo.dto;

public class WarningDTO {
  private Long id;         // 경고 ID
  private int postId;      // 게시글 ID (int형으로 수정)
  private String userId;   // 사용자 ID
  private String reason;    // 신고 사유

  public WarningDTO(Long id, int postId, String userId, String reason) {
      this.id = id;
      this.postId = postId;  // int형으로 저장
      this.userId = userId;
      this.reason = reason;
  }

  // Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public int getPostId() { return postId; }
  public void setPostId(int postId) { this.postId = postId; }
  public String getUserId() { return userId; }
  public void setUserId(String userId) { this.userId = userId; }
  public String getReason() { return reason; }
  public void setReason(String reason) { this.reason = reason; }
}

