package com.Phong.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Phong.backend.dto.request.order.OrderRequest;
import com.Phong.backend.dto.response.ApiResponse;
import com.Phong.backend.dto.response.order.OrderResponse;
import com.Phong.backend.entity.order.Order;
import com.Phong.backend.service.OrderService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class OrderController {

    private OrderService orderService;

    @PostMapping("/create")
    public ApiResponse<OrderResponse> createOrder(@RequestBody OrderRequest request) {
        try {
            Order order = orderService.createOrderFromCart(
                    request.getCustomerId(), request.getAddressId(), request.getCartItems(), request.isUseLoyalty());

            return ApiResponse.<OrderResponse>builder()
                    .message("Order created successfully")
                    .result(mapToResponse(order))
                    .build();
        } catch (Exception e) {
            return ApiResponse.<OrderResponse>builder()
                    .message("Error creating order: " + e.getMessage())
                    .build();
        }
    }

    private OrderResponse mapToResponse(Order order) {
        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .status(order.getStatus())
                .totalPrice(order.getTotalPrice())
                .totalLoyalty(order.getTotalLoyalty())
                .totalDiscount(order.getTotalDiscount())
                .totalAmount(order.getTotalAmount())
                .shippingFee(order.getShippingFee())
                .orderDate(order.getOrderDate().toString())
                .build();
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<Order>>> getOrdersByCustomer(@RequestParam Long customerId) {
        ApiResponse<List<Order>> response = orderService.getOrdersByCustomer(customerId);
        return ResponseEntity.status(response.getCode() == 1000 ? 200 : 404).body(response);
    }

    @GetMapping("/details")
    public ResponseEntity<ApiResponse<Order>> getOrderDetails(@RequestParam String id) {
        ApiResponse<Order> response = orderService.getOrderDetails(id);
        return ResponseEntity.status(response.getCode() == 1000 ? 200 : 404).body(response);
    }

    @PutMapping("/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelOrder(@RequestParam String id) {
        ApiResponse<Void> response = orderService.cancelOrder(id);
        return ResponseEntity.status(response.getCode() == 1000 ? 200 : 400).body(response);
    }
}
