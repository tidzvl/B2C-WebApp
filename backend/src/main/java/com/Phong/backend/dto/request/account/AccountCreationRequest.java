package com.Phong.backend.dto.request.account;

import jakarta.validation.constraints.Size;

import com.Phong.backend.entity.account.Role;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountCreationRequest {
    @Size(min = 5, max = 50, message = "Username must be between 5 and 50 characters")
    String username;

    @Size(min = 8, message = "Password must be at least 8 characters long")
    String password;

    Role role;
}
