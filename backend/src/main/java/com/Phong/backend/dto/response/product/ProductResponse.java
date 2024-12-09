package com.Phong.backend.dto.response.product;

import java.util.List;

import com.Phong.backend.entity.product.ProductImage;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private Long productId;
    private String name;
    private String description;
    private Double price;
    private String origin;
    private String version;
    private String evaluate;
    private List<ProductImage> images;
    private Integer stockQuantity;
    private Integer quantitySold;
    private String categoryName;
}
