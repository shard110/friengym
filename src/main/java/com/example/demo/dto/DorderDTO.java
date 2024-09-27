package com.example.demo.dto;

public class DorderDTO {
    private int doNum;
    private int doCount;
    private int doPrice;
    private ProductDTO product;

    // 기본 생성자
    public DorderDTO() {}

    // getter와 setter
    public int getDoNum() {
        return doNum;
    }

    public void setDoNum(int doNum) {
        this.doNum = doNum;
    }

    public int getDoCount() {
        return doCount;
    }

    public void setDoCount(int doCount) {
        this.doCount = doCount;
    }

    public int getDoPrice() {
        return doPrice;
    }

    public void setDoPrice(int doPrice) {
        this.doPrice = doPrice;
    }

    public ProductDTO getProduct() {
        return product;
    }

    public void setProduct(ProductDTO product) {
        this.product = product;
    }
}
