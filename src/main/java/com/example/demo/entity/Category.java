package com.example.demo.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Entity
@Data
public class Category {
    @Id
    @Column(name = "catenum")
    @JsonProperty("catenum")
      private int catenum;

    @Column(name = "catename")
    @JsonProperty("catename")
      private String catename;

     @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Product> products;

    // Getters and Setters
    public int getCatenum() {
      return catenum;
  }

  public void setCatenum(int catenum) {
      this.catenum = catenum;
  }

  public String getCatename() {
      return catename;
  }

  public void setCatename(String catename) {
      this.catename = catename;
  }

  public List<Product> getProducts() {
      return products;
  }

  public void setProducts(List<Product> products) {
      this.products = products;
  }
}