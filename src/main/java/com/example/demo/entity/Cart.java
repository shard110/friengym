package com.example.demo.entity;


import jakarta.persistence.*;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "cart")
public class Cart implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cnum;

    private int cCount;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "pnum")
    private Product product;

    public int getCnum() {
        return this.cnum;
    }

    public void setCnum(int cnum) {
        this.cnum = cnum;
    }

    public int getcCount() {
        return this.cCount;
    }

    public void setcCount(int cCount) {
        this.cCount = cCount;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Product getProduct() {
        return this.product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

}
