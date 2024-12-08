package com.Phong.backend.dto.request.employee;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SellerUpdateRequest {
    String firstName;
    String lastName;
    String address;
    LocalDate birthday;
    LocalDate startWorkingDate;
    String citizenId;

    @Email
    String email;

    @Size(max = 10)
    String phone;

    String avatar;

    String sex;
}
