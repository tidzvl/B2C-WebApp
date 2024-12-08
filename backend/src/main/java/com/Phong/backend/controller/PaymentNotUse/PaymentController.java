// package com.Phong.backend.controller;
//
// import com.Phong.backend.dto.request.Payment.CallbackRequest;
// import com.Phong.backend.dto.response.ApiResponse;
// import com.Phong.backend.service.PaymentService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
//
// @RestController
// @RequestMapping("/payment")
// @RequiredArgsConstructor
// public class PaymentController {
//
//    private final PaymentService paymentService;
//
//    @GetMapping("/generate-qr")
//    public ResponseEntity<String> generateQrForOrder(@RequestParam Long orderId) {
//
//        String qrLink = paymentService.generatePaymentQrLink(orderId);
//
//        return ResponseEntity.ok(qrLink);
//    }
// }
//
