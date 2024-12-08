package com.Phong.backend.dto.request.customer;

import java.time.LocalDate;

import com.Phong.backend.entity.Gender;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomerUpdateRequest {
    String firstName;
    String lastName;
    Gender gender;
    String citizenId;
    LocalDate birthday;
    String email;
    String phone;
    String address;
    String avatar;
}
