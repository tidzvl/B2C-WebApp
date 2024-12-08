package com.Phong.backend.dto.request.product;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class DiscountRequest {
    private String name;
    private String description;
    private Double discountValue;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private List<Long> productIds; // Danh sách ID sản phẩm
    private Long categoryId; // ID của category (nếu chọn theo category)
    private boolean applyToAll; // Áp dụng cho toàn bộ sản phẩm
}
