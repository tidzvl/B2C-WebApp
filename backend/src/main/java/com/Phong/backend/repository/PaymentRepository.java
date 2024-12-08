package com.Phong.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Phong.backend.entity.invoice.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {}
