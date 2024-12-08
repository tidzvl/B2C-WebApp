package com.Phong.backend.entity.product;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import jakarta.persistence.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "discount")
public class Discount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long discountId; // Mã khuyến mãi

    private String name; // Tên khuyến mãi

    private String description;

    private double discountValue; // Giá trị khuyến mãi (có thể là % hoặc số tiền)

    @Column(nullable = false)
    private LocalDateTime startDate; // Ngày bắt đầu khuyến mãi

    @Column(nullable = false)
    private LocalDateTime endDate; // Ngày kết thúc khuyến mãi

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "discount_products",
            joinColumns = @JoinColumn(name = "discount_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id"))
    @JsonIgnore
    private List<Product> products = new ArrayList<>();
}
