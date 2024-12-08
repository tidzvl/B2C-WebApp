package com.Phong.backend.dto.request.employee;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SellerCreationRequest {
    @NotBlank
    String firstName;

    @NotBlank
    String lastName;

    String citizenId;

    LocalDate birthday;

    LocalDate startWorkingDate;

    @NotBlank
    @Email
    String email;

    @Size(max = 10)
    String phone;

    String address;

    String avatar;

    String accountId;

    String sex;
}
