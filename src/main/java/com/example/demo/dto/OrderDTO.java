package com.example.demo.dto;

import java.util.Date;
import java.util.List;

public class OrderDTO {
    private int onum;
    private String paymentId;
    private String status;
    private Date odate;
    private String id;
    private List<DorderDTO> dorders;

    public int getOnum() {
        return onum;
    }

    public void setOnum(int onum) {
        this.onum = onum;
    }

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

    public List<DorderDTO> getDorders() {
        return dorders;
    }

    public void setDorders(List<DorderDTO> dorders) {
        this.dorders = dorders;
    }
}
