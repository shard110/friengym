package com.example.demo.dto;

import java.sql.Timestamp;

public class AskDTO {
    private int anum;
    private Timestamp aDate;
    private String atitle;
    private String acontents;
    private String userId; // User ID를 추가
    private String reply; // 답변 내용을 추가
    private String afile; // 첨부파일 추가

    // Constructor
    public AskDTO(int anum, Timestamp aDate, String atitle, String acontents, String userId, String reply, String afile) {
        this.anum = anum;
        this.aDate = aDate;
        this.atitle = atitle;
        this.acontents = acontents;
        this.userId = userId; // User ID 할당
        this.reply = reply; // 답변 내용 할당
        this.afile = afile; // 첨부파일 할당
    }

    // Getter와 Setter
    public int getAnum() {
        return anum;
    }

    public void setAnum(int anum) {
        this.anum = anum;
    }

    public Timestamp getaDate() {
        return aDate;
    }

    public void setaDate(Timestamp aDate) {
        this.aDate = aDate;
    }

    public String getAtitle() {
        return atitle;
    }

    public void setAtitle(String atitle) {
        this.atitle = atitle;
    }

    public String getAcontents() {
        return acontents;
    }

    public void setAcontents(String acontents) {
        this.acontents = acontents;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public String getAfile() { // afile에 대한 Getter 추가
        return afile;
    }

    public void setAfile(String afile) { // afile에 대한 Setter 추가
        this.afile = afile;
    }
}
