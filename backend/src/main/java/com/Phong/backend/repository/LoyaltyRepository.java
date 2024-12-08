package com.Phong.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Phong.backend.entity.customer.Loyalty;

@Repository
public interface LoyaltyRepository extends JpaRepository<Loyalty, Long> {
    Loyalty findByCustomer_CustomerId(Long customerId);
}
