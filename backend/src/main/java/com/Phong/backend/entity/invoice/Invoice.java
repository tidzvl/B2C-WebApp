package com.Phong.backend.entity.invoice;

import java.util.Date;
import java.util.List;

import jakarta.persistence.*;

import com.Phong.backend.entity.customer.Address;
import com.Phong.backend.entity.customer.Customer;
import com.Phong.backend.entity.order.Order;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address deliveryAddress;

    @OneToOne
    private Order order;

    @ManyToOne
    private Customer customer;

    @Column(nullable = false, updatable = false)
    private String sellerName = "IT HOSPITAL";

    @Column(nullable = false, updatable = false)
    private String sellerAddress = "HCMUT";

    @Column(nullable = false, updatable = false)
    private String sellerPhone = "0944102246";

    @Column(nullable = true, updatable = false)
    private String website = "IT HOSPITAL";

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<InvoiceDetail> details;

    @Enumerated(EnumType.STRING)
    private InvoiceStatus status;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    private Date createdAt;
    private double totalLoyalty;
    private double totalDiscount;
    private double totalPrice;
    private double shippingFee;
    private double totalAmount;
}
