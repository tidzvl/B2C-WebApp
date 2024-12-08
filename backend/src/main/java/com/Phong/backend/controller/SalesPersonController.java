package com.Phong.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Phong.backend.dto.request.employee.SellerCreationRequest;
import com.Phong.backend.dto.request.employee.SellerUpdateRequest;
import com.Phong.backend.dto.response.ApiResponse;
import com.Phong.backend.dto.response.employee.SellerResponse;
import com.Phong.backend.service.SalesPersonService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/salesperson")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SalesPersonController {
    SalesPersonService service;

    @PostMapping
    public ResponseEntity<ApiResponse<SellerResponse>> createPersonnel(@RequestBody SellerCreationRequest request) {
        SellerResponse response = service.createPersonnel(request);
        return new ResponseEntity<>(
                ApiResponse.<SellerResponse>builder()
                        .message("Personnel created successfully")
                        .result(response)
                        .build(),
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SellerResponse>>> getAllPersonnel() {
        List<SellerResponse> response = service.getAllPersonnel();
        return new ResponseEntity<>(
                ApiResponse.<List<SellerResponse>>builder()
                        .message("Fetched all personnel successfully")
                        .result(response)
                        .build(),
                HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SellerResponse>> getPersonnelById(@PathVariable Long id) {
        return service.getPersonnelById(id)
                .map(personnel -> new ResponseEntity<>(
                        ApiResponse.<SellerResponse>builder()
                                .message("Personnel fetched successfully")
                                .result(personnel)
                                .build(),
                        HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(
                        ApiResponse.<SellerResponse>builder()
                                .message("Personnel not found")
                                .build(),
                        HttpStatus.NOT_FOUND));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<SellerResponse>> updatePersonnel(
            @PathVariable Long id, @RequestBody SellerUpdateRequest request) {
        SellerResponse response = service.updatePersonnel(id, request);
        return new ResponseEntity<>(
                ApiResponse.<SellerResponse>builder()
                        .message("Personnel updated successfully")
                        .result(response)
                        .build(),
                HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePersonnel(@PathVariable Long id) {
        boolean deleted = service.deletePersonnel(id);
        if (deleted) {
            return new ResponseEntity<>(
                    ApiResponse.<Void>builder()
                            .message("Personnel deleted successfully")
                            .build(),
                    HttpStatus.OK);
        } else {
            return new ResponseEntity<>(
                    ApiResponse.<Void>builder().message("Personnel not found").build(), HttpStatus.NOT_FOUND);
        }
    }
}
