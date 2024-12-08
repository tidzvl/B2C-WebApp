package com.Phong.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Phong.backend.entity.product.Discount;

public interface DiscountRepository extends JpaRepository<Discount, Long> {}
