package com.Phong.backend.dto.response.order;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class OrderResponse {
    private String orderId; // ID của đơn hàng
    private String status;
    private String orderDate;
    private Double totalPrice;
    private Double totalLoyalty;
    private Double totalDiscount;
    private Double shippingFee;
    private Double totalAmount;
}
