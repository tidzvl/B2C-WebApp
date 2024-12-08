package com.Phong.backend.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Phong.backend.entity.customer.Address;
import com.Phong.backend.entity.invoice.Invoice;
import com.Phong.backend.entity.invoice.InvoiceDetail;
import com.Phong.backend.entity.product.Product;
import com.Phong.backend.repository.InvoiceDetailRepository;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;

@Service
public class PdfGeneratorService {

    @Autowired
    InvoiceDetailRepository invoiceDetailRepository;

    public String generateInvoicePdf(Invoice invoice) throws Exception {

        String directoryPath = "invoices";
        File directory = new File(directoryPath);

        if (!directory.exists()) {
            if (!directory.mkdirs()) {
                throw new IOException("Failed to create directory: " + directoryPath);
            }
        }

        String pdfPath = directoryPath + File.separator + "invoice_" + invoice.getId() + ".pdf";

        if (invoice.getDetails() == null) {
            invoice.setDetails(new ArrayList<>());
        }

        try (PdfWriter writer = new PdfWriter(new FileOutputStream(pdfPath));
                PdfDocument pdfDocument = new PdfDocument(writer);
                Document document = new Document(pdfDocument)) {

            // Tiêu đề "INVOICE"
            Paragraph title = new Paragraph("INVOICE")
                    .setFontSize(24)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(title);

            // Thông tin người bán
            Table sellerTable = new Table(new float[] {1, 1});
            sellerTable.setWidth(UnitValue.createPercentValue(100));

            sellerTable.addCell(new Cell()
                    .add(new Paragraph("Seller: " + invoice.getSellerName()).setBold())
                    .setBorder(null)
                    .setTextAlignment(TextAlignment.LEFT));
            sellerTable.addCell(new Cell()
                    .add(new Paragraph("Website: " + invoice.getWebsite()).setBold())
                    .setBorder(null)
                    .setTextAlignment(TextAlignment.RIGHT));
            sellerTable.addCell(new Cell()
                    .add(new Paragraph("Phone: " + invoice.getSellerPhone()))
                    .setBorder(null)
                    .setTextAlignment(TextAlignment.LEFT));
            sellerTable.addCell(new Cell()
                    .add(new Paragraph("Address: " + invoice.getSellerAddress()))
                    .setBorder(null)
                    .setTextAlignment(TextAlignment.RIGHT));
            document.add(sellerTable);

            document.add(new Paragraph("------------------------------------------------------------"));

            Table customerAndAddressTable = new Table(new float[] {1, 1});
            customerAndAddressTable.setWidth(UnitValue.createPercentValue(100));
            // Thông tin khách hàng
            String customerInfo = "";
            if (invoice.getCustomer() != null) {
                customerInfo += "Customer:\n";
                customerInfo += "Customer Name: " + invoice.getCustomer().getFirstName() + " "
                        + invoice.getCustomer().getLastName() + "\n";
                customerInfo += "Phone: " + invoice.getCustomer().getPhone() + "\n";
                customerInfo += "Email: " + invoice.getCustomer().getEmail() + "\n";
            }
            customerAndAddressTable.addCell(new Cell()
                    .add(new Paragraph(customerInfo).setBold())
                    .setBorder(null)
                    .setTextAlignment(TextAlignment.LEFT));

            // Địa chỉ giao hàng
            String deliveryInfo = "";
            Address deliveryAddress = invoice.getDeliveryAddress();
            if (deliveryAddress != null) {
                deliveryInfo += "Delivery Address:\n";
                deliveryInfo += deliveryAddress.getFullName() + "\n";
                deliveryInfo += deliveryAddress.getStreet() + "\n";
                deliveryInfo += deliveryAddress.getCity() + ", " + deliveryAddress.getState() + " "
                        + deliveryAddress.getZipCode() + "\n";
                deliveryInfo += deliveryAddress.getCountry();
            }
            customerAndAddressTable.addCell(new Cell()
                    .add(new Paragraph(deliveryInfo).setBold())
                    .setBorder(null)
                    .setTextAlignment(TextAlignment.RIGHT));

            document.add(customerAndAddressTable);

            document.add(new Paragraph("------------------------------------------------------------"));

            // Thông tin đơn hàng
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm - dd/MM/yyyy");
            if (invoice.getOrder() != null) {
                document.add(new Paragraph("Order ID: " + invoice.getOrder().getOrderId()));
                document.add(new Paragraph(
                        "Order Date: " + invoice.getOrder().getOrderDate().format(formatter)));
            }

            document.add(new Paragraph("Invoice #" + invoice.getId())
                    .setFontSize(16)
                    .setBold()
                    .setMarginBottom(10));
            document.add(new Paragraph("Payment Method: " + invoice.getPaymentMethod())
                    .setBold()
                    .setFontSize(12)
                    .setMarginBottom(15)); // Chữ in đậm

            // Bảng sản phẩm
            float[] columnWidths = {4, 2, 2, 3};
            Table table = new Table(columnWidths);
            table.setWidth(UnitValue.createPercentValue(100));

            // Header
            table.addHeaderCell(new Cell()
                    .add(new Paragraph("Product").setBold())
                    .setBackgroundColor(new com.itextpdf.kernel.colors.DeviceGray(0.75f)) // Nền xám
                    .setTextAlignment(TextAlignment.CENTER));
            table.addHeaderCell(new Cell()
                    .add(new Paragraph("Quantity").setBold())
                    .setBackgroundColor(new com.itextpdf.kernel.colors.DeviceGray(0.75f))
                    .setTextAlignment(TextAlignment.CENTER));
            table.addHeaderCell(new Cell()
                    .add(new Paragraph("Unit Price").setBold())
                    .setBackgroundColor(new com.itextpdf.kernel.colors.DeviceGray(0.75f))
                    .setTextAlignment(TextAlignment.CENTER));
            table.addHeaderCell(new Cell()
                    .add(new Paragraph("Total Price").setBold())
                    .setBackgroundColor(new com.itextpdf.kernel.colors.DeviceGray(0.75f))
                    .setTextAlignment(TextAlignment.CENTER));

            // Dữ liệu
            List<InvoiceDetail> details = invoiceDetailRepository.findByInvoice_Id(invoice.getId());
            for (InvoiceDetail detail : details) {
                Product product = detail.getProduct();
                table.addCell(new Cell()
                        .add(new Paragraph(product != null ? product.getName() : "Unknown Product"))
                        .setTextAlignment(TextAlignment.CENTER));
                table.addCell(new Cell()
                        .add(new Paragraph(String.valueOf(detail.getQuantity())))
                        .setTextAlignment(TextAlignment.CENTER));
                table.addCell(new Cell()
                        .add(new Paragraph(String.format("%.2f", detail.getUnitPrice())))
                        .setTextAlignment(TextAlignment.CENTER));
                table.addCell(new Cell()
                        .add(new Paragraph(String.format("%.2f", detail.getTotalPrice())))
                        .setTextAlignment(TextAlignment.CENTER));
            }
            document.add(table);

            // Tổng tiền
            document.add(new Paragraph("Total Price: " + String.format("%.2f", invoice.getTotalPrice()) + " VND")
                    .setMarginTop(5));
            document.add(new Paragraph("Total Loyalty: " + String.format("%.2f", invoice.getTotalLoyalty()) + " VND")
                    .setMarginTop(5));
            document.add(new Paragraph("Total Discount: " + String.format("%.2f", invoice.getTotalDiscount()) + " VND")
                    .setMarginTop(5));
            document.add(new Paragraph("Shipping Fee: " + String.format("%.2f", invoice.getShippingFee()) + " VND")
                    .setMarginTop(5));
            document.add(new Paragraph("Total Amount: " + String.format("%.2f", invoice.getTotalAmount()) + " VND")
                    .setBold()
                    .setFontSize(14)
                    .setMarginTop(10));

            document.close();
        }

        return pdfPath;
    }
}
