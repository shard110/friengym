package com.example.demo.dto;

public class ProductListDTO {
    private int pNum;
    private String pName;
    private int pPrice;
    private String pImgUrl;
    private int pCount;

    public ProductListDTO(int pNum, String pName, int pPrice, String pImgUrl, int pCount) {
        this.pNum = pNum;
        this.pName = pName;
        this.pPrice = pPrice;
        this.pImgUrl = pImgUrl;
        this.pCount = pCount;
    }

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
}
