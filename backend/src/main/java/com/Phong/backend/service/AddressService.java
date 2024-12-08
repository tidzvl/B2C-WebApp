package com.Phong.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.Phong.backend.dto.request.customer.AddressRequest;
import com.Phong.backend.dto.response.customer.AddressResponse;
import com.Phong.backend.entity.customer.Address;
import com.Phong.backend.entity.customer.Customer;
import com.Phong.backend.repository.AddressRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;

    public List<AddressResponse> getAddressesByCustomer(Customer customer) {
        return addressRepository.findByCustomer(customer).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public AddressResponse addAddress(Customer customer, AddressRequest addressRequest) {
        Address address = Address.builder()
                .fullName(addressRequest.getFullName())
                .phone(addressRequest.getPhone())
                .email(addressRequest.getEmail())
                .street(addressRequest.getStreet())
                .city(addressRequest.getCity())
                .state(addressRequest.getState())
                .zipCode(addressRequest.getZipCode())
                .country(addressRequest.getCountry())
                .customer(customer)
                .build();

        Address savedAddress = addressRepository.save(address);
        return convertToResponse(savedAddress);
    }

    public AddressResponse patchAddress(Long id, AddressRequest addressRequest) {
        Address address = addressRepository.findById(id).orElseThrow(() -> new RuntimeException("Address not found"));

        // Chỉ cập nhật các trường không null từ AddressRequest
        if (address.getFullName() != null) {
            address.setFullName(addressRequest.getFullName());
        }
        if (address.getPhone() != null) {
            address.setPhone(addressRequest.getPhone());
        }
        if (address.getEmail() != null) {
            address.setEmail(addressRequest.getEmail());
        }
        if (addressRequest.getStreet() != null) {
            address.setStreet(addressRequest.getStreet());
        }
        if (addressRequest.getCity() != null) {
            address.setCity(addressRequest.getCity());
        }
        if (addressRequest.getState() != null) {
            address.setState(addressRequest.getState());
        }
        if (addressRequest.getZipCode() != null) {
            address.setZipCode(addressRequest.getZipCode());
        }
        if (addressRequest.getCountry() != null) {
            address.setCountry(addressRequest.getCountry());
        }

        Address updatedAddress = addressRepository.save(address);
        return convertToResponse(updatedAddress);
    }

    public void deleteAddress(Long id) {
        if (!addressRepository.existsById(id)) {
            throw new RuntimeException("Address not found");
        }
        addressRepository.deleteById(id);
    }

    private AddressResponse convertToResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getAddressId())
                .fullName(address.getFullName())
                .phone(address.getPhone())
                .email(address.getEmail())
                .street(address.getStreet())
                .city(address.getCity())
                .state(address.getState())
                .zipCode(address.getZipCode())
                .country(address.getCountry())
                .build();
    }
}
