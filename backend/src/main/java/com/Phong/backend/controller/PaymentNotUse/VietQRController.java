// package com.Phong.backend.controller;
//
// import com.Phong.backend.dto.request.Payment.VietQRRequest;
// import com.Phong.backend.dto.response.ApiResponse;
// import com.Phong.backend.service.VietQRService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;
//
// @RestController
// @RequestMapping("/payment")
// @RequiredArgsConstructor
// public class VietQRController {
//
//    private final VietQRService vietQRService;
//
//    // POST /api/payment/qr
//    @PostMapping("/qr")
//    public ResponseEntity<ApiResponse<String>> generateVietQR(@RequestBody VietQRRequest request) {
//        String qrDataUrl = vietQRService.generateVietQR(request);
//        return ResponseEntity.ok(ApiResponse.<String>builder()
//                .message("QR Code generated successfully")
//                .result(qrDataUrl)
//                .build());
//    }
// }
//
