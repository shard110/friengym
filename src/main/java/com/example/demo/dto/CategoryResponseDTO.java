package com.example.demo.dto;

import java.util.List;
import java.util.stream.Collectors;

import com.example.demo.entity.Category;

public class CategoryResponseDTO {
    private int catenum;
    private String catename;
    private List<ProductResponseDTO> products;

    // Constructor to convert Category entity to CategoryResponseDTO
    public CategoryResponseDTO(Category category) {
        this.catenum = category.getCatenum();
        this.catename = category.getCatename();
        this.products = category.getProducts().stream()
                                .map(ProductResponseDTO::new)
                                .collect(Collectors.toList());
    }

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

    public List<ProductResponseDTO> getProducts() {
        return products;
    }

    public void setProducts(List<ProductResponseDTO> products) {
        this.products = products;
    }
}
