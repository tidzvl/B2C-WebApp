package com.Phong.backend.entity.customer;

import java.time.LocalDate;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Loyalty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long loyaltyId;

    @OneToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    private int points;
    private int accumulationNumber;

    @Column(name = "CreateAt")
    private LocalDate CreateAt;
}
