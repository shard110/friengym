package com.example.demo.dto;

import java.util.Date;

public class ProductDetailDTO {
    private int pNum;
    private String pName;
    private int pPrice;
    private String pImgUrl;
    private int pCount;
    private Date pDate;
    private String pDetailImgUrl;

    // 모든 변수를 사용하는 생성자
    public ProductDetailDTO(int pNum, String pName, int pPrice, String pImgUrl, int pCount, Date pDate, String pDetailImgUrl) {
        this.pNum = pNum;
        this.pName = pName;
        this.pPrice = pPrice;
        this.pImgUrl = pImgUrl;
        this.pCount = pCount;
        this.pDate = pDate;
        this.pDetailImgUrl = pDetailImgUrl;
    }

    // Getters and Setters
    public int getpNum() {
        return pNum;
    }

    public void setpNum(int pNum) {
        this.pNum = pNum;
    }

    public String getpName() {
        return pName;
    }

    public void setpName(String pName) {
        this.pName = pName;
    }

    public int getpPrice() {
        return pPrice;
    }

    public void setpPrice(int pPrice) {
        this.pPrice = pPrice;
    }

    public String getpImgUrl() {
        return pImgUrl;
    }

    public void setpImgUrl(String pImgUrl) {
        this.pImgUrl = pImgUrl;
    }

    public int getpCount() {
        return pCount;
    }

    public void setpCount(int pCount) {
        this.pCount = pCount;
    }

    public Date getpDate() {
        return pDate;
    }

    public void setpDate(Date pDate) {
        this.pDate = pDate;
    }

    public String getpDetailImgUrl() {
        return pDetailImgUrl;
    }

    public void setpDetailImgUrl(String pDetailImgUrl) {
        this.pDetailImgUrl = pDetailImgUrl;
    }
}
