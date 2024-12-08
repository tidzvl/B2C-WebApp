package com.Phong.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Phong.backend.entity.cart.Cart;
import com.Phong.backend.entity.cart.CartItem;
import com.Phong.backend.entity.product.Product;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
}
