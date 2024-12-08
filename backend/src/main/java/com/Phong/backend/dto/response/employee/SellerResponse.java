package com.Phong.backend.dto.response.employee;

import java.time.LocalDate;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SellerResponse {
    Long personelId;
    String firstName;
    String lastName;
    String citizenId;
    String email;
    String phone;
    String address;
    String avatar;
    LocalDate birthday;
    LocalDate startWorkingDate;
    String sex;
    double salesPerformance;
    String accountId;
}
