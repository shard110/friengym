package com.example.demo.model;

import java.sql.Date;
import java.util.List;

public class PaymentRequest {
    private String paymentId;
    private String status;
    private Date odate;
    private String id;
    
    private List<DorderRequest> dorders;
    private String orderId;
    private int amount;

    public PaymentRequest() {}

    public String getPaymentId() {
        return paymentId;
    }
    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public Date getOdate() {
        return odate;
    }
    public void setOdate(Date odate) {
        this.odate = odate;
    }
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public List<DorderRequest> getDorders() {
        return dorders;
    }
    public void setDorders(List<DorderRequest> dorders) {
        this.dorders = dorders;
    }
    public String getOrderId() {
        return orderId;
    }
    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }
    public int getAmount() {
        return amount;
    }
    public void setAmount(int amount) {
        this.amount = amount;
    }
}
