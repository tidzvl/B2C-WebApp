package com.Phong.backend.service;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Phong.backend.dto.response.ApiResponse;
import com.Phong.backend.dto.response.customer.LoyaltyResponse;
import com.Phong.backend.entity.customer.Loyalty;
import com.Phong.backend.repository.CustomerRepository;
import com.Phong.backend.repository.LoyaltyRepository;

@Service
public class LoyaltyService {

    @Autowired
    private LoyaltyRepository loyaltyRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public void addPoints(Long customerId, double transactionAmount) {
        Loyalty loyalty = loyaltyRepository.findByCustomer_CustomerId(customerId);

        if (loyalty == null) {
            loyalty = Loyalty.builder()
                    .customer(customerRepository
                            .findById(customerId)
                            .orElseThrow(() -> new RuntimeException("Customer not found")))
                    .points(0)
                    .accumulationNumber(0)
                    .CreateAt(LocalDate.now())
                    .build();
        }

        int pointsToAdd = (int) (transactionAmount / 100);
        loyalty.setPoints(loyalty.getPoints() + pointsToAdd);

        loyaltyRepository.save(loyalty);
    }

    public ApiResponse<LoyaltyResponse> getLoyaltyInfo(Long customerId) {
        Loyalty loyalty = loyaltyRepository.findByCustomer_CustomerId(customerId);
        if (loyalty == null) {
            return new ApiResponse<>(0, "Loyalty information not found for customer", null);
        }

        // Map Loyalty entity to LoyaltyDTO
        LoyaltyResponse loyaltydto = new LoyaltyResponse(
                loyalty.getLoyaltyId(),
                loyalty.getCustomer().getCustomerId(),
                loyalty.getPoints(),
                loyalty.getAccumulationNumber());

        return new ApiResponse<>(1000, "Loyalty information retrieved successfully", loyaltydto);
    }
}
