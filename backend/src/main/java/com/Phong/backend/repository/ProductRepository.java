package com.Phong.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.Phong.backend.entity.product.Product;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    List<Product> findByNameContainingIgnoreCase(String nameKeyword);

    @Query("SELECT p FROM Product p JOIN FETCH p.discounts WHERE p.productId = :productId")
    Optional<Product> findByIdWithDiscounts(@Param("productId") Long productId);
}
