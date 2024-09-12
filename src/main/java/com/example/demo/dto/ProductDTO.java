package com.example.demo.dto;

public class ProductDTO {
    private int pNum;
    private String pName;
    private int pPrice;
    private String pImgUrl;
    

    public ProductDTO(int pNum, String pName, int pPrice, String pImgUrl) {
        this.pNum = pNum;
        this.pName = pName;
        this.pPrice = pPrice;
        this.pImgUrl = pImgUrl;
    }

    public int getpNum() {
        return this.pNum;
    }

    public void setpNum(int pNum) {
        this.pNum = pNum;
    }

    public String getpName() {
        return this.pName;
    }

    public void setpName(String pName) {
        this.pName = pName;
    }

    public int getpPrice() {
        return this.pPrice;
    }

    public void setpPrice(int pPrice) {
        this.pPrice = pPrice;
    }

    public String getpImgUrl() {
        return this.pImgUrl;
    }

    public void setpImgUrl(String pImgUrl) {
        this.pImgUrl = pImgUrl;
    }

}
