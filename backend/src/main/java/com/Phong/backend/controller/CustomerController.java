package com.Phong.backend.controller;

import java.io.IOException;
import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.Phong.backend.dto.request.customer.CustomerCreationRequest;
import com.Phong.backend.dto.request.customer.CustomerUpdateRequest;
import com.Phong.backend.dto.response.ApiResponse;
import com.Phong.backend.dto.response.customer.CustomerResponse;
import com.Phong.backend.entity.customer.Avatar;
import com.Phong.backend.service.CustomerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    public ResponseEntity<ApiResponse<CustomerResponse>> createCustomer(
            @Valid @RequestBody CustomerCreationRequest request) {
        return ResponseEntity.ok(customerService.createCustomer(request));
    }

    @PatchMapping("/{customerId}")
    public ResponseEntity<ApiResponse<CustomerResponse>> updateCustomer(
            @PathVariable Long customerId, @Valid @RequestBody CustomerUpdateRequest request) {
        return ResponseEntity.ok(customerService.updateCustomer(customerId, request));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CustomerResponse>>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<ApiResponse<CustomerResponse>> getCustomerById(@PathVariable Long customerId) {
        return ResponseEntity.ok(customerService.getCustomerById(customerId));
    }

    @DeleteMapping("/{customerId}")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(customerService.deleteCustomer(customerId));
    }

    @PostMapping("/avatar/{customerId}")
    public ResponseEntity<ApiResponse<Avatar>> updateAvatar(
            @PathVariable Long customerId, @RequestParam("file") MultipartFile file) throws IOException {
        Avatar avatar = customerService.updateAvatar(customerId, file);
        return ResponseEntity.ok(ApiResponse.<Avatar>builder()
                .message("Avatar updated successfully")
                .build());
    }
}
