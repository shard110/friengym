import okhttp3.*;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class PaymentService {

    private final String API_URL = "https://api.portone.io/v2";
    private final String API_KEY = "your_api_key";
    private final String API_SECRET = "your_api_secret";
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
            .url(API_URL + "/payments")
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
}
