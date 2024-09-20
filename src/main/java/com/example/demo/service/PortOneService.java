package com.example.demo.service;

import java.io.IOException;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@Service
public class PortOneService {
    private final String API_URL = "https://api.portone.io/v2";
    private final String API_KEY = "your_api_key";
    private final String API_SECRET = "your_api_secret";
    private final OkHttpClient client = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String getAccessToken() throws IOException {
        RequestBody body = new FormBody.Builder()
            .add("api_key", API_KEY)
            .add("api_secret", API_SECRET)
            .build();

        Request request = new Request.Builder()
            .url(API_URL + "/auth/token")
            .post(body)
            .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);
            return objectMapper.readTree(response.body().string()).get("access_token").asText();
        }
    }

    // 결제 요청, 조회 등의 메서드 추가
}