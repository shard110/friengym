package com.example.demo.service;

import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.example.demo.model.PaymentRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;

@Service
public class PaymentService {

    @Value("${portone.api.url}")
    private String apiUrl;

    @Value("${portone.api.key}")
    private String apiKey;

    @Value("${portone.api.secret}")
    private String apiSecret;

    private final OkHttpClient client = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String requestPayment(PaymentRequest paymentRequest) throws IOException {
        String accessToken = getAccessToken();

        RequestBody body = new FormBody.Builder()
            .add("amount", String.valueOf(paymentRequest.getAmount()))
            .add("order_id", paymentRequest.getOrderId())
            // 기타 결제 정보 추가
            .build();

        Request request = new Request.Builder()
            .url(apiUrl + "/payments")
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
            .add("api_key", apiKey)
            .add("api_secret", apiSecret)
            .build();

        Request request = new Request.Builder()
            .url(apiUrl + "/auth/token")
            .post(body)
            .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);
            return objectMapper.readTree(response.body().string()).get("access_token").asText();
        }
    }
}
