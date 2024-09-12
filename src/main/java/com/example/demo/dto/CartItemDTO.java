package com.example.demo.dto;

public class CartItemDTO {
    private int cnum;
    private int cCount;
    private ProductDTO product;

    public CartItemDTO(int cnum, int cCount, ProductDTO product) {
        this.cnum = cnum;
        this.cCount = cCount;
        this.product = product;
    }

    public int getCnum() {
        return cnum;
    }

    public void setCnum(int cnum) {
        this.cnum = cnum;
    }

    public int getcCount() {
        return cCount;
    }

    public void setcCount(int cCount) {
        this.cCount = cCount;
    }

    public ProductDTO getProduct() {
        return product;
    }

    public void setProduct(ProductDTO product) {
        this.product = product;
    }
}
