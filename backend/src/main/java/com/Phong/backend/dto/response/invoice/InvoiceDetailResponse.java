package com.Phong.backend.dto.response.invoice;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceDetailResponse {
    private String productName;
    private int quantity;
    private double unitPrice;
    private double totalPrice;

    public static InvoiceDetailResponse fromEntity(com.Phong.backend.entity.invoice.InvoiceDetail detail) {
        return InvoiceDetailResponse.builder()
                .productName(
                        detail.getProduct().getName()) // Giả sử bạn có phương thức getProduct() trong InvoiceDetail
                .quantity(detail.getQuantity())
                .unitPrice(detail.getUnitPrice())
                .totalPrice(detail.getTotalPrice())
                .build();
    }
}
