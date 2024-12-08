package com.Phong.backend.dto.request.order;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequest {
    private Long customerId;
    private Long addressId;
    private List<CartItemDiscountRequest> cartItems;
    private Boolean isUseLoyalty;

    public Boolean isUseLoyalty() {
        return isUseLoyalty;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CartItemDiscountRequest {
        private Long cartItemId;
        private Long discountId; // null nếu không có mã khuyến mãi
    }
}
