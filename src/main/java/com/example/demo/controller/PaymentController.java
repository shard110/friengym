package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.OrderDTO;
import com.example.demo.entity.Ordertbl;
import com.example.demo.model.PaymentRequest;
import com.example.demo.service.CartService;
import com.example.demo.service.OrderService;
import com.example.demo.service.PaymentService;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private CartService cartService;

     @GetMapping("/orders/{id}")
     public ResponseEntity<List<OrderDTO>> getOrdersByUserId(@PathVariable String id) {
        List<OrderDTO> orders = orderService.getOrdersByUserId(id);
        return ResponseEntity.ok(orders);
    }

    @PostMapping("/request")
    public ResponseEntity<?> requestPayment(@RequestBody PaymentRequest paymentRequest) {
        try {
            String paymentResponse = paymentService.requestPayment(paymentRequest);
            return ResponseEntity.ok(paymentResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("결제 요청 중 오류 발생: " + e.getMessage());
        }
    }

    @PostMapping("/complete")
    public ResponseEntity<?> completePayment(@RequestBody PaymentRequest paymentRequest, @RequestHeader("Authorization") String token) {

        try {
            paymentService.processPayment(paymentRequest);
            cartService.clearCart(paymentRequest.getId());
            return ResponseEntity.ok("결제 완료");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("결제 실패");
        }
    }
}
