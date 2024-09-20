package com.example.demo.model;

public class PaymentRequest {
    private int amount;
    private String orderId;
    // 기타 결제 정보 필드 추가

    // 기본 생성자
    public PaymentRequest() {}

    // 매개변수가 있는 생성자
    public PaymentRequest(int amount, String orderId) {
        this.amount = amount;
        this.orderId = orderId;
    }

    // Getters and Setters
    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    // 기타 결제 정보 필드의 Getters and Setters 추가
}
