package com.example.demo.dto;

public class CartItemDTO {
    private int cnum;
    private int cCount;
    private ProductDTO product;
    private UserDTO user;

    // Constructors
    public CartItemDTO() {}

    public CartItemDTO(int cnum, int cCount, ProductDTO product, UserDTO user) {
        this.cnum = cnum;
        this.cCount = cCount;
        this.product = product;
        this.user = user;
    }

    // Getters and Setters
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

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }
}
