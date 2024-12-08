package com.Phong.backend.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Phong.backend.dto.request.customer.AddressRequest;
import com.Phong.backend.dto.response.ApiResponse;
import com.Phong.backend.dto.response.customer.AddressResponse;
import com.Phong.backend.entity.customer.Customer;
import com.Phong.backend.repository.CustomerRepository;
import com.Phong.backend.service.AddressService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/address")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;
    private final CustomerRepository customerRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AddressResponse>>> getAddresses(@RequestParam Long customerId) {
        Customer customer =
                customerRepository.findById(customerId).orElseThrow(() -> new RuntimeException("Customer not found"));
        List<AddressResponse> addresses = addressService.getAddressesByCustomer(customer);
        return ResponseEntity.ok(ApiResponse.<List<AddressResponse>>builder()
                .message("Danh sách địa chỉ của người dùng")
                .result(addresses)
                .build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AddressResponse>> addAddress(
            @RequestParam Long customerId, @Valid @RequestBody AddressRequest addressRequest) {
        Customer customer =
                customerRepository.findById(customerId).orElseThrow(() -> new RuntimeException("Customer not found"));
        AddressResponse addressResponse = addressService.addAddress(customer, addressRequest);
        return ResponseEntity.ok(ApiResponse.<AddressResponse>builder()
                .message("Đã thêm địa chỉ mới")
                .result(addressResponse)
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder().message("Địa chỉ đã được xóa").build());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<AddressResponse>> patchAddress(
            @PathVariable Long id, @RequestBody AddressRequest addressRequest) {
        AddressResponse updatedAddress = addressService.patchAddress(id, addressRequest);
        return ResponseEntity.ok(ApiResponse.<AddressResponse>builder()
                .message("Địa chỉ đã được cập nhật một phần")
                .result(updatedAddress)
                .build());
    }
}
