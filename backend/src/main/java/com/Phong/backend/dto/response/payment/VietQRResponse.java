package com.Phong.backend.dto.response.payment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VietQRResponse {
    private String qrCode; // Mã QR văn bản
    private String qrDataURL; // Mã QR dạng Data URI (ảnh Base64)
}
