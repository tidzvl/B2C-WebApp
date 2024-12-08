package com.Phong.backend.service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.Phong.backend.dto.request.customer.CustomerCreationRequest;
import com.Phong.backend.dto.request.customer.CustomerUpdateRequest;
import com.Phong.backend.dto.response.ApiResponse;
import com.Phong.backend.dto.response.customer.CustomerResponse;
import com.Phong.backend.entity.account.Account;
import com.Phong.backend.entity.cart.Cart;
import com.Phong.backend.entity.customer.Avatar;
import com.Phong.backend.entity.customer.Customer;
import com.Phong.backend.entity.customer.Loyalty;
import com.Phong.backend.repository.*;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final AccountRepository accountRepository;
    private final CartRepository cartRepository;
    private final CloudinaryService cloudinaryService;
    private final AvatarRepository avatarRepository;
    private final LoyaltyRepository loyaltyRepository;

    /**
     * Create a new customer.
     */
    public ApiResponse<CustomerResponse> createCustomer(CustomerCreationRequest request) {
        Account account = accountRepository
                .findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Customer customer = Customer.builder()
                .account(account)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .gender(request.getGender())
                .citizenId(request.getCitizenId())
                .birthday(request.getBirthday())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .avatar(request.getAvatar())
                .build();

        customer = customerRepository.save(customer);

        Loyalty loyalty = Loyalty.builder()
                .customer(customer)
                .points(0)
                .accumulationNumber(0)
                .CreateAt(LocalDate.now())
                .build();

        loyaltyRepository.save(loyalty);
        customer.setLoyalty(loyalty);

        Cart cart = new Cart();
        cart.setCustomer(customer);
        cart.setTotalPrice(0.0);
        cartRepository.save(cart);

        customer.setCart(cart);

        return ApiResponse.<CustomerResponse>builder()
                .message("Customer created successfully")
                .result(mapToResponse(customer))
                .build();
    }

    /**
     * Update an existing customer.
     */
    public ApiResponse<CustomerResponse> updateCustomer(Long customerId, CustomerUpdateRequest request) {
        Customer customer =
                customerRepository.findById(customerId).orElseThrow(() -> new RuntimeException("Customer not found"));

        if (request.getFirstName() != null) customer.setFirstName(request.getFirstName());
        if (request.getLastName() != null) customer.setLastName(request.getLastName());
        if (request.getGender() != null) customer.setGender(request.getGender());
        if (request.getCitizenId() != null) customer.setCitizenId(request.getCitizenId());
        if (request.getBirthday() != null) customer.setBirthday(request.getBirthday());
        if (request.getEmail() != null) customer.setEmail(request.getEmail());
        if (request.getPhone() != null) customer.setPhone(request.getPhone());
        if (request.getAddress() != null) customer.setAddress(request.getAddress());
        if (request.getAvatar() != null) customer.setAvatar(request.getAvatar());

        customer = customerRepository.save(customer);
        return ApiResponse.<CustomerResponse>builder()
                .message("Customer updated successfully")
                .result(mapToResponse(customer))
                .build();
    }

    /**
     * Retrieve all customers.
     */
    public ApiResponse<List<CustomerResponse>> getAllCustomers() {
        List<CustomerResponse> customers =
                customerRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
        return ApiResponse.<List<CustomerResponse>>builder()
                .message("Fetched all customers successfully")
                .result(customers)
                .build();
    }

    /**
     * Retrieve a customer by ID.
     */
    public ApiResponse<CustomerResponse> getCustomerById(Long customerId) {
        Customer customer =
                customerRepository.findById(customerId).orElseThrow(() -> new RuntimeException("Customer not found"));
        return ApiResponse.<CustomerResponse>builder()
                .message("Customer fetched successfully")
                .result(mapToResponse(customer))
                .build();
    }

    /**
     * Delete a customer.
     */
    public ApiResponse<Void> deleteCustomer(Long customerId) {
        if (!customerRepository.existsById(customerId)) {
            return ApiResponse.<Void>builder()
                    .code(404)
                    .message("Customer not found")
                    .build();
        }
        customerRepository.deleteById(customerId);
        return ApiResponse.<Void>builder()
                .message("Customer deleted successfully")
                .build();
    }

    /**
     * Map Customer entity to CustomerResponse DTO.
     */
    private CustomerResponse mapToResponse(Customer customer) {
        return CustomerResponse.builder()
                .customerId(customer.getCustomerId())
                .firstName(customer.getFirstName())
                .lastName(customer.getLastName())
                .gender(customer.getGender())
                .citizenId(customer.getCitizenId())
                .birthday(customer.getBirthday())
                .email(customer.getEmail())
                .phone(customer.getPhone())
                .address(customer.getAddress())
                .avatar(customer.getAvatar())
                .build();
    }

    public Avatar updateAvatar(Long customerId, MultipartFile file) throws IOException {
        Customer customer =
                customerRepository.findById(customerId).orElseThrow(() -> new RuntimeException("Customer not found"));

        Map uploadResult = cloudinaryService.uploadImage(file);
        String url = (String) uploadResult.get("url");
        String cloudinaryId = (String) uploadResult.get("public_id");

        Avatar avatar = Avatar.builder()
                .name(file.getOriginalFilename())
                .url(url)
                .cloudinaryId(cloudinaryId)
                .data(file.getBytes())
                .uploadedBy(customer)
                .build();

        return avatarRepository.save(avatar);
    }
}
