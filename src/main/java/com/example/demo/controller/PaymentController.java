import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/request")
    public ResponseEntity<?> requestPayment(@RequestBody PaymentRequest paymentRequest) {
        try {
            String paymentResponse = paymentService.requestPayment(paymentRequest);
            return ResponseEntity.ok(paymentResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("결제 요청 중 오류 발생: " + e.getMessage());
        }
    }
}
