// package com.Phong.backend.service;
//
// import com.Phong.backend.dto.request.Payment.VietQRRequest;
// import com.Phong.backend.dto.response.payment.VietQRResponse;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.HttpEntity;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.MediaType;
// import org.springframework.http.ResponseEntity;
// import org.springframework.stereotype.Service;
// import org.springframework.web.client.RestTemplate;
//
// @Service
// @RequiredArgsConstructor
// public class VietQRService {
//
//    private static final String VIETQR_API_URL = "https://api.vietqr.io/v2/generate";
//    private static final String CLIENT_ID = "cef1a630-4275-4bd7-9396-4c4b62129ca5"; // Thay bằng ID từ VietQR.IO
//    private static final String API_KEY = "4f2fe467-f145-4521-a3af-d788fc099934";     // Thay bằng API Key từ
// VietQR.IO
//
//    public String generateVietQR(VietQRRequest request) {
//        try {
//            RestTemplate restTemplate = new RestTemplate();
//
//            // Header của yêu cầu
//            HttpHeaders headers = new HttpHeaders();
//            headers.set("x-client-id", CLIENT_ID);
//            headers.set("x-api-key", API_KEY);
//            headers.setContentType(MediaType.APPLICATION_JSON);
//
//            // Body của yêu cầu
//            HttpEntity<VietQRRequest> entity = new HttpEntity<>(request, headers);
//
//            // Gửi POST request
//            ResponseEntity<VietQRResponse> response = restTemplate.postForEntity(VIETQR_API_URL, entity,
// VietQRResponse.class);
//
//            // Xử lý kết quả trả về
//            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
//                return response.getBody().getQrDataURL(); // Trả về QR Code dạng Data URL
//            } else {
//                throw new RuntimeException("Failed to generate VietQR");
//            }
//        } catch (Exception ex) {
//            throw new RuntimeException("Error while generating VietQR", ex);
//        }
//    }
// }
