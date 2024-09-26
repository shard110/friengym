package com.example.demo.service;

import okhttp3.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.stereotype.Service;


import com.example.demo.entity.Dorder;
import com.example.demo.entity.Ordertbl;
import com.example.demo.model.DorderRequest;
import com.example.demo.model.PaymentRequest;
import com.example.demo.repository.DorderRepository;
import com.example.demo.repository.OrderRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.transaction.Transactional;

import java.io.IOException;

@Service
public class PaymentService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private DorderRepository dorderRepository;

    @Value("${portone.api.url}")
    private String apiUrl;

    @Value("${portone.api.key}")
    private String apiKey;

    @Value("${portone.api.secret}")
    private String apiSecret;

    private final OkHttpClient client = new OkHttpClient();

    @Transactional
    public void processPayment(PaymentRequest paymentRequest) {
        // 주문 정보 저장
        Ordertbl order = new Ordertbl();
        order.setPaymentId(paymentRequest.getPaymentId());
        order.setStatus(paymentRequest.getStatus());
        order.setOdate(paymentRequest.getOdate());
        order.setId(paymentRequest.getId());
        orderRepository.save(order);

        // 주문 상세 정보 저장
        for (DorderRequest dorderRequest : paymentRequest.getDorders()) {
            Dorder dorder = new Dorder();
            dorder.setDoCount(dorderRequest.getDoCount());
            dorder.setDoPrice(dorderRequest.getDoPrice());
            dorder.setProduct(dorderRequest.getProduct());
            dorder.setOrdertbl(order);
            dorderRepository.save(dorder);
        }
    }

    public String requestPayment(PaymentRequest paymentRequest) throws IOException {
        String accessToken = getAccessToken();

        RequestBody body = new FormBody.Builder()
            .add("amount", String.valueOf(paymentRequest.getAmount()))
            .add("order_id", paymentRequest.getOrderId())
            .add("payment_id", paymentRequest.getPaymentId())
            .add("status", paymentRequest.getStatus())
            .add("odate", paymentRequest.getOdate().toString())
            .add("user_id", paymentRequest.getId())
            .build();

        Request request = new Request.Builder()
            .url("https://api.portone.io/v2/payments")
            .post(body)
            .addHeader("Authorization", "Bearer " + accessToken)
            .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);
            return response.body().string();
        }
    }

    private String getAccessToken() throws IOException {
        RequestBody body = new FormBody.Builder()
            .add("apiKey", apiKey)
            .add("apiSecret", apiSecret)
            .build();

        Request request = new Request.Builder()
            .url("https://api.portone.io/v2/auth/token")
            .post(body)
            .addHeader("Content-Type", "application/json")
            .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);
            String responseBody = response.body().string();
            // JSON 파싱하여 액세스 토큰 추출
            return extractAccessToken(responseBody);
        }
    }

    private String extractAccessToken(String responseBody) {
        // JSON 파싱 로직 추가
        return "parsed_access_token";
    }
}