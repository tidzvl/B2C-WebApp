package com.Phong.backend.dto.response.customer;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AddressResponse {
    private Long id;
    private String fullName;
    private String phone;
    private String email;
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private String country;
}
