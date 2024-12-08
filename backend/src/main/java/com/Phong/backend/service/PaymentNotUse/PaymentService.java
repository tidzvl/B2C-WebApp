// package com.Phong.backend.service;
//
// import com.Phong.backend.dto.request.Payment.CallbackRequest;
// import com.Phong.backend.entity.order.Order;
// import com.Phong.backend.repository.OrderRepository;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.boot.web.client.RestTemplateBuilder;
// import org.springframework.http.HttpEntity;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.HttpMethod;
// import org.springframework.http.ResponseEntity;
// import org.springframework.stereotype.Service;
// import org.springframework.web.client.RestTemplate;
//
// import java.util.HashMap;
// import java.util.Map;
//
//
// @Service
// public class PaymentService {
//
//    private final OrderRepository orderRepository;
//    private final RestTemplate restTemplate;
//    public PaymentService(RestTemplateBuilder restTemplateBuilder, OrderRepository orderRepository) {
//        this.restTemplate = restTemplateBuilder.build();
//        this.orderRepository = orderRepository;
//    }
//
//    // Thông tin mặc định cho thanh toán
//    private static final String BANK_ID = "970436";
//    private static final String ACCOUNT_NO = "1027796337";
//    private static final String ACCOUNT_NAME = "NGUYEN TUAN PHONG";  // Tên tài khoản viết hoa không dấu
//    private static final String TEMPLATE = "print";
//
//    public String generatePaymentQrLink(Long orderId) {
//        Order order = orderRepository.findById(orderId)
//                .orElseThrow(() -> new RuntimeException("Order not found"));
//
//        double amount = order.getTotalAmount();
//
//        String addInfo = order.getOrderDetails().stream()
//                .map(detail -> detail.getProduct().getName())
//                .limit(25)
//                .reduce((name1, name2) -> name1 + ", " + name2)
//                .orElse("Thanh toan don hang");
//
//        StringBuilder quickLink = new StringBuilder("https://img.vietqr.io/image/")
//                .append(BANK_ID).append("-").append(ACCOUNT_NO).append("-").append(TEMPLATE).append(".png");
//
//        quickLink.append("?amount=").append(amount);
//        quickLink.append("&addInfo=").append(addInfo.replace(" ", "%20"));
//        quickLink.append("&accountName=").append(ACCOUNT_NAME.replace(" ", "%20"));
//
//        return quickLink.toString();
//    }
// }
