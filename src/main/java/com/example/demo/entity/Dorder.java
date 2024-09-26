package com.example.demo.entity;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
public class Dorder implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "donum")
    private int doNum;

    @Column(name = "docount", nullable = false)
    private int doCount;

    @Column(name = "doprice", nullable = false) // 주문 당시의 상품 가격 저장 = product.pprice (소계가 아님)
    private int doPrice;

    @ManyToOne
    @JoinColumn(name = "onum")
    private Ordertbl ordertbl;

    @ManyToOne
    @JoinColumn(name = "pnum")
    private Product product;

    public Dorder(){}
    
    public int getDoNum() {
        return this.doNum;
    }

    public void setDoNum(int doNum) {
        this.doNum = doNum;
    }

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

    public Ordertbl getOrdertbl() {
        return this.ordertbl;
    }

    public void setOrdertbl(Ordertbl ordertbl) {
        this.ordertbl = ordertbl;
    }

    public Product getProduct() {
        return this.product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
    
}
