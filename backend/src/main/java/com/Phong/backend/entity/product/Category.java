package com.Phong.backend.entity.product;

import java.util.List;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;

    private String name;
    private String description;

    @OneToMany(fetch = FetchType.LAZY)
    private List<Product> products;
}
