package com.Phong.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Phong.backend.dto.request.Cart.UpdateQuantityRequest;
import com.Phong.backend.dto.response.ApiResponse;
import com.Phong.backend.dto.response.Cart.CartItemResponse;
import com.Phong.backend.entity.cart.Cart;
import com.Phong.backend.service.CartService;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // Thêm sản phẩm vào giỏ hàng
    @PostMapping("/add")
    public ApiResponse<Cart> addProductToCart(
            @RequestParam Long customerId, @RequestParam Long productId, @RequestParam int quantity) {
        return cartService.addProductToCart(customerId, productId, quantity);
    }

    @DeleteMapping("/remove")
    public ResponseEntity<ApiResponse<Void>> removeProductFromCart(
            @RequestParam Long cartId, @RequestParam Long productId) {
        ApiResponse<Void> response = cartService.removeProductFromCart(cartId, productId);
        return ResponseEntity.status(response.getCode() == 404 ? HttpStatus.NOT_FOUND : HttpStatus.OK)
                .body(response);
    }

    @GetMapping("/allItems")
    public ResponseEntity<ApiResponse<List<CartItemResponse>>> getAllProductsInCart(@RequestParam Long customerId) {
        ApiResponse<List<CartItemResponse>> response = cartService.getAllProductsInCart(customerId);
        return ResponseEntity.status(response.getCode() == 404 ? HttpStatus.NOT_FOUND : HttpStatus.OK)
                .body(response);
    }

    @PutMapping("/quantity")
    public ResponseEntity<ApiResponse<Cart>> updateProductQuantityInCart(
            @RequestParam Long cartId,
            @RequestParam Long productId,
            @RequestBody UpdateQuantityRequest updateQuantityRequest) {

        ApiResponse<Cart> response =
                cartService.updateProductQuantityInCart(cartId, productId, updateQuantityRequest.getNewQuantity());

        return ResponseEntity.status(response.getCode() == 1000 ? 200 : 400).body(response);
    }
}
