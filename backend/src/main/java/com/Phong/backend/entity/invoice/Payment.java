package com.Phong.backend.entity.invoice;

import java.util.Date;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    private String id;

    private long orderCode;
    private double amount;
    private double amountRemaining;

    private Date createdAt;

    private String status;
}
