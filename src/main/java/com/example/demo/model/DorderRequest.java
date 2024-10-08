package com.example.demo.model;

import com.example.demo.entity.Product;

public class DorderRequest {
    private int doCount;
    private int doPrice;
    private Product product;

    public int getDoCount() {
        return this.doCount;
    }

    public void setDoCount(int doCount) {
        this.doCount = doCount;
    }

    public int getDoPrice() {
        return this.doPrice;
    }

    public void setDoPrice(int doPrice) {
        this.doPrice = doPrice;
    }

    public Product getProduct() {
        return this.product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }


}
