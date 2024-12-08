package com.Phong.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.Phong.backend.dto.request.product.DiscountRequest;
import com.Phong.backend.dto.response.ApiResponse;
import com.Phong.backend.dto.response.product.DiscountResponse;
import com.Phong.backend.service.DiscountService;

@RestController
@RequestMapping("/discounts")
@Validated
public class DiscountController {

    @Autowired
    private DiscountService discountService;

    @PostMapping
    public ResponseEntity<ApiResponse<DiscountResponse>> createDiscount(
            @RequestBody @Validated DiscountRequest request) {
        ApiResponse<DiscountResponse> response = discountService.createDiscount(request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{discountId}")
    public ResponseEntity<ApiResponse<DiscountResponse>> patchDiscount(
            @PathVariable Long discountId, @RequestBody DiscountRequest request) {
        return ResponseEntity.ok(discountService.patchDiscount(discountId, request));
    }

    @DeleteMapping("/{discountId}")
    public ResponseEntity<ApiResponse<String>> deleteDiscount(@PathVariable Long discountId) {
        ApiResponse<String> response = discountService.deleteDiscount(discountId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<String>>> getDiscountsForProduct(@PathVariable Long productId) {
        ApiResponse<List<String>> response = discountService.getDiscountsForProduct(productId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ApiResponse<List<DiscountResponse>> getAllDiscounts() {
        return discountService.getAllDiscounts();
    }
}
