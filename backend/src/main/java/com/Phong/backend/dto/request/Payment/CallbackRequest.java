package com.Phong.backend.dto.request.Payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CallbackRequest {
    private String bankAccount;
    private String content;
    private long amount;
    private String bankCode;
    private String transType;
}
