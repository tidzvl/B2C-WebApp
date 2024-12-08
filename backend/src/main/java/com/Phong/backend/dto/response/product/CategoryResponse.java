package com.Phong.backend.dto.response.product;

import java.util.List;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponse {
    private Long categoryId;
    private String name;
    private String description;
    private List<String> productNames;
}
