package com.Phong.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Phong.backend.entity.product.ProductImage;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {}
