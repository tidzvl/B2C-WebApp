package com.Phong.backend.dto.response.customer;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
public class LoyaltyResponse {
    private Long loyaltyId;
    private Long customerId;
    private int points;
    private int accumulationNumber;

    public LoyaltyResponse(Long loyaltyId, Long customerId, int points, int accumulationNumber) {
        this.loyaltyId = loyaltyId;
        this.customerId = customerId;
        this.points = points;
        this.accumulationNumber = accumulationNumber;
    }
}
