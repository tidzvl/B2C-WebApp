package com.Phong.backend.dto.request.Payment;

import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VietQRRequest {
    @NotNull
    private String accountNo; // Số tài khoản ngân hàng thụ hưởng

    private String accountName; // Tên tài khoản ngân hàng

    @NotNull
    private String acqId; // Mã ngân hàng (BIN)

    private Integer amount; // Số tiền (VNĐ)
    private String addInfo; // Nội dung giao dịch
    private String template; // Template QR trả về (compact, qr_only, v.v.)
}
