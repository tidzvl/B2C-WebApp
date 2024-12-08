package com.Phong.backend.service;

import org.springframework.stereotype.Service;

import com.Phong.backend.entity.invoice.Invoice;

@Service
public class InvoiceProcessingService {

    private final PdfGeneratorService pdfGeneratorService;
    private final EmailService emailService;

    // Constructor injection
    public InvoiceProcessingService(PdfGeneratorService pdfGeneratorService, EmailService emailService) {
        this.pdfGeneratorService = pdfGeneratorService;
        this.emailService = emailService;
    }

    public void processInvoice(Invoice invoice) throws Exception {
        pdfGeneratorService.generateInvoicePdf(invoice);
    }

    public void processInvoice(Invoice invoice, String userEmail) throws Exception {
        String pdfPath = pdfGeneratorService.generateInvoicePdf(invoice);

        emailService.sendEmail(
                userEmail,
                "Your Invoice #" + invoice.getId(),
                "Thank you for your purchase. Please find your invoice attached.",
                pdfPath);
    }
}
