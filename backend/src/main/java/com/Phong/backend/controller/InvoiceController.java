package com.Phong.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Phong.backend.dto.request.invoice.InvoiceRequest;
import com.Phong.backend.dto.response.ApiResponse;
import com.Phong.backend.dto.response.invoice.InvoiceDetailResponse;
import com.Phong.backend.dto.response.invoice.InvoiceResponse;
import com.Phong.backend.service.InvoiceService;

@RestController
@RequestMapping("/invoice")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<InvoiceResponse>> createInvoice(@RequestBody InvoiceRequest requestDTO) {
        InvoiceResponse response = invoiceService.createInvoice(requestDTO);
        return ResponseEntity.ok(ApiResponse.<InvoiceResponse>builder()
                .message("Invoice created successfully")
                .result(response)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InvoiceResponse>> getInvoiceById(@PathVariable String id) {
        InvoiceResponse response = invoiceService.getInvoiceById(id);
        return ResponseEntity.ok(ApiResponse.<InvoiceResponse>builder()
                .message("Invoice retrieved successfully")
                .result(response)
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getAllInvoices() {
        List<InvoiceResponse> responses = invoiceService.getAllInvoices();
        return ResponseEntity.ok(ApiResponse.<List<InvoiceResponse>>builder()
                .message("All invoices retrieved successfully")
                .result(responses)
                .build());
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelInvoice(@PathVariable String id) {
        invoiceService.cancelInvoice(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Invoice cancelled successfully")
                .build());
    }

    @GetMapping("/{invoiceId}/details")
    public ApiResponse<List<InvoiceDetailResponse>> getInvoiceDetails(@PathVariable String invoiceId) {
        List<InvoiceDetailResponse> invoiceDetails = invoiceService.getInvoiceDetailsByInvoiceId(invoiceId);
        return ApiResponse.<List<InvoiceDetailResponse>>builder()
                .code(1000) // Mã trạng thái (có thể thay đổi theo yêu cầu)
                .message("Successfully retrieved invoice details")
                .result(invoiceDetails)
                .build();
    }
}
