package com.Phong.backend.entity.invoice;

import jakarta.persistence.*;

import com.Phong.backend.entity.product.Product;

import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long invoiceDetailId;

    @ManyToOne
    @JoinColumn(name = "id", nullable = false)
    private Invoice invoice;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private int quantity;
    private double unitPrice;

    private double totalPrice;
}
