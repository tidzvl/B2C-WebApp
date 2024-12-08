package com.Phong.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Phong.backend.entity.cart.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByCustomer_CustomerId(Long customerId);
}
