package com.Phong.backend.service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Phong.backend.dto.request.invoice.InvoiceRequest;
import com.Phong.backend.dto.response.invoice.InvoiceDetailResponse;
import com.Phong.backend.dto.response.invoice.InvoiceResponse;
import com.Phong.backend.entity.invoice.Invoice;
import com.Phong.backend.entity.invoice.InvoiceDetail;
import com.Phong.backend.entity.invoice.InvoiceStatus;
import com.Phong.backend.entity.invoice.PaymentMethod;
import com.Phong.backend.entity.order.Order;
import com.Phong.backend.entity.order.OrderDetail;
import com.Phong.backend.repository.InvoiceDetailRepository;
import com.Phong.backend.repository.InvoiceRepository;
import com.Phong.backend.repository.OrderDetailRepository;
import com.Phong.backend.repository.OrderRepository;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceDetailRepository invoiceDetailRepository;
    private final OrderRepository orderRepository;
    private final InvoiceProcessingService invoiceProcessingService;
    private final OrderDetailRepository orderDetailRepository;
    private final LoyaltyService loyaltyService;

    public InvoiceService(
            InvoiceRepository invoiceRepository,
            InvoiceDetailRepository invoiceDetailRepository,
            OrderRepository orderRepository,
            InvoiceProcessingService invoiceProcessingService,
            OrderDetailRepository orderDetailRepository,
            LoyaltyService loyaltyService) {
        this.invoiceRepository = invoiceRepository;
        this.invoiceDetailRepository = invoiceDetailRepository;
        this.orderRepository = orderRepository;
        this.invoiceProcessingService = invoiceProcessingService;
        this.orderDetailRepository = orderDetailRepository;
        this.loyaltyService = loyaltyService;
    }

    @Transactional
    public InvoiceResponse createInvoice(InvoiceRequest requestDTO) {
        Order order = orderRepository
                .findById(requestDTO.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus("In Progress");

        Invoice invoice = new Invoice();
        invoice.setOrder(order);
        invoice.setDeliveryAddress(order.getDeliveryAddress());
        invoice.setShippingFee(order.getShippingFee());
        invoice.setTotalPrice(order.getTotalPrice());
        invoice.setTotalAmount(order.getTotalAmount());
        invoice.setPaymentMethod(PaymentMethod.COD);
        invoice.setStatus(InvoiceStatus.PENDING);
        invoice.setCreatedAt(new Date());
        invoice.setCustomer(order.getCustomer());
        invoice.setTotalDiscount(order.getTotalDiscount());
        invoice.setTotalLoyalty(order.getTotalLoyalty());
        invoice = invoiceRepository.save(invoice);

        Invoice savedInvoice = invoiceRepository.save(invoice);
        // Tạo chi tiết hóa đơn
        List<InvoiceDetail> invoiceDetails = order.getOrderDetails().stream()
                .map(orderDetail -> {
                    InvoiceDetail detail = new InvoiceDetail();
                    detail.setInvoice(savedInvoice);
                    detail.setProduct(orderDetail.getProduct());
                    detail.setQuantity(orderDetail.getQuantity());
                    detail.setUnitPrice(orderDetail.getPrice());
                    detail.setTotalPrice(orderDetail.getPrice() * orderDetail.getQuantity());
                    return detail;
                })
                .collect(Collectors.toList());

        invoiceDetailRepository.saveAll(invoiceDetails);

        List<OrderDetail> details =
                orderDetailRepository.findByOrderOrderId(invoice.getOrder().getOrderId());
        for (OrderDetail detail : details) {
            detail.getProduct().setQuantitySold(detail.getQuantity());
            detail.getProduct().setStockQuantity(detail.getProduct().getStockQuantity() - detail.getQuantity());
        }

        loyaltyService.addPoints(invoice.getCustomer().getCustomerId(), invoice.getTotalPrice());

        String email = order.getCustomer().getEmail();
        try {
            invoiceProcessingService.processInvoice(invoice, email);
        } catch (Exception e) {
            System.err.println("Error processing invoice: " + e.getMessage());
            e.printStackTrace();
        }

        return InvoiceResponse.builder()
                .invoiceId(invoice.getId())
                .deliveryAddress(invoice.getDeliveryAddress())
                .status(invoice.getStatus())
                .totalAmount(invoice.getTotalAmount())
                .shippingFee(invoice.getShippingFee())
                .paymentMethod(invoice.getPaymentMethod())
                .date(invoice.getCreatedAt())
                .totalPrice(invoice.getTotalPrice())
                .totalLoyalty(invoice.getTotalLoyalty())
                .totalDiscount(invoice.getTotalDiscount())
                .totalAmount(invoice.getTotalAmount())
                .build();
    }

    public InvoiceResponse getInvoiceById(String id) {
        Invoice invoice = invoiceRepository.findById(id).orElseThrow(() -> new RuntimeException("Invoice not found"));

        return InvoiceResponse.builder()
                .invoiceId(invoice.getId())
                .deliveryAddress(invoice.getDeliveryAddress())
                .status(invoice.getStatus())
                .totalAmount(invoice.getTotalAmount())
                .shippingFee(invoice.getShippingFee())
                .paymentMethod(invoice.getPaymentMethod())
                .date(invoice.getCreatedAt())
                .totalPrice(invoice.getTotalPrice())
                .totalLoyalty(invoice.getTotalLoyalty())
                .totalDiscount(invoice.getTotalDiscount())
                .totalAmount(invoice.getTotalAmount())
                .build();
    }

    public void cancelInvoice(String id) {
        Invoice invoice = invoiceRepository.findById(id).orElseThrow(() -> new RuntimeException("Invoice not found"));
        invoice.setStatus(InvoiceStatus.CANCELLED);
        invoiceRepository.save(invoice);
    }

    public List<InvoiceDetailResponse> getInvoiceDetailsByInvoiceId(String invoiceId) {
        return invoiceDetailRepository.findByInvoice_Id(invoiceId).stream()
                .map(InvoiceDetailResponse::fromEntity) // Chuyển từ entity sang DTO
                .collect(Collectors.toList());
    }

    public List<InvoiceResponse> getAllInvoices() {
        return invoiceRepository.findAll().stream()
                .map(invoice -> InvoiceResponse.builder()
                        .invoiceId(invoice.getId())
                        .deliveryAddress(invoice.getDeliveryAddress())
                        .status(invoice.getStatus())
                        .totalAmount(invoice.getTotalAmount())
                        .shippingFee(invoice.getShippingFee())
                        .paymentMethod(invoice.getPaymentMethod())
                        .date(invoice.getCreatedAt())
                        .totalPrice(invoice.getTotalPrice())
                        .totalLoyalty(invoice.getTotalLoyalty())
                        .totalDiscount(invoice.getTotalDiscount())
                        .totalAmount(invoice.getTotalAmount())
                        .build())
                .collect(Collectors.toList());
    }
}
