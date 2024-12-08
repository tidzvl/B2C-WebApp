package com.Phong.backend.dto.response.invoice;

import java.util.Date;

import com.Phong.backend.entity.customer.Address;
import com.Phong.backend.entity.invoice.InvoiceStatus;
import com.Phong.backend.entity.invoice.PaymentMethod;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceResponse {
    private String invoiceId;
    private Address deliveryAddress;
    private InvoiceStatus status;
    private PaymentMethod paymentMethod;
    private Date date;
    private double totalPrice;
    private double totalLoyalty;
    private double totalDiscount;
    private double shippingFee;
    private double totalAmount;
}
