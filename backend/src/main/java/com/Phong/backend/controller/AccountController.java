package com.Phong.backend.controller;

import java.util.List;
import java.util.Optional;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Phong.backend.dto.request.account.AccountCreationRequest;
import com.Phong.backend.dto.request.account.AccountUpdateRequest;
import com.Phong.backend.dto.response.ApiResponse;
import com.Phong.backend.dto.response.account.AccountResponse;
import com.Phong.backend.service.AccountService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/account")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AccountController {
    private final AccountService accountService;

    // Create Account
    @PostMapping
    public ResponseEntity<ApiResponse<AccountResponse>> createAccount(
            @Valid @RequestBody AccountCreationRequest accountRequest) {
        AccountResponse createdAccount = accountService.createAccount(accountRequest);
        ApiResponse<AccountResponse> response = ApiResponse.<AccountResponse>builder()
                .message("Account created successfully")
                .result(createdAccount)
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Get all Accounts
    @GetMapping
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getAllAccounts() {
        List<AccountResponse> accounts = accountService.getAllAccounts();
        ApiResponse<List<AccountResponse>> response = ApiResponse.<List<AccountResponse>>builder()
                .message("Fetched all accounts successfully")
                .result(accounts)
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Get Account by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountResponse>> getAccountById(@PathVariable String id) {
        Optional<AccountResponse> account = accountService.getAccountById(id);
        if (account.isPresent()) {
            ApiResponse<AccountResponse> response = ApiResponse.<AccountResponse>builder()
                    .message("Account fetched successfully")
                    .result(account.get())
                    .build();
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        ApiResponse<AccountResponse> response = ApiResponse.<AccountResponse>builder()
                .message("Account not found")
                .build();
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    // Update Account
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountResponse>> updateAccount(
            @PathVariable String id, @RequestBody AccountUpdateRequest accountRequest) {
        AccountResponse updatedAccount = accountService.updateAccount(id, accountRequest);
        if (updatedAccount != null) {
            ApiResponse<AccountResponse> response = ApiResponse.<AccountResponse>builder()
                    .message("Account updated successfully")
                    .result(updatedAccount)
                    .build();
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        ApiResponse<AccountResponse> response = ApiResponse.<AccountResponse>builder()
                .message("Account not found")
                .build();
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    // Delete Account
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(@PathVariable String id) {
        boolean isDeleted = accountService.deleteAccount(id);
        ApiResponse<Void> response;
        if (isDeleted) {
            response = ApiResponse.<Void>builder()
                    .message("Account deleted successfully")
                    .build();
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response = ApiResponse.<Void>builder().message("Account not found").build();
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }
}
