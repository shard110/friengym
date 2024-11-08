package com.example.demo.dto;

import com.example.demo.entity.Product;

public class ProductResponseDTO {
  private int pNum;
  private String pName;
  private int pPrice;
  private String pImgUrl;
  private String categoryName;

  // Constructor to convert Product entity to ProductResponseDTO
  public ProductResponseDTO(Product product) {
      this.pNum = product.getpNum();
      this.pName = product.getpName();
      this.pPrice = product.getpPrice();
      this.pImgUrl = product.getpImgUrl();
      this.categoryName = product.getCategory() != null ? product.getCategory().getCatename() : null;
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

  public String getCategoryName() {
      return categoryName;
  }

  public void setCategoryName(String categoryName) {
      this.categoryName = categoryName;
  }
}
