package com.Phong.backend.PayOS;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.Phong.backend.entity.invoice.*;
import com.Phong.backend.entity.order.Order;
import com.Phong.backend.entity.order.OrderDetail;
import com.Phong.backend.repository.*;
import com.Phong.backend.service.InvoiceProcessingService;
import com.Phong.backend.service.LoyaltyService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import vn.payos.PayOS;
import vn.payos.type.CheckoutResponseData;
import vn.payos.type.ItemData;
import vn.payos.type.PaymentData;
import vn.payos.type.PaymentLinkData;

@RestController
@RequestMapping("/payment")
public class PaymentController {
    private final PayOS payOS;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private InvoiceDetailRepository invoiceDetailRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private InvoiceProcessingService invoiceProcessingService;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private LoyaltyService loyaltyService;

    public PaymentController(PayOS payOS) {
        super();
        this.payOS = payOS;
    }

    public void savePayment(ObjectNode response) {
        try {
            // Lấy dữ liệu từ response
            ObjectMapper mapper = new ObjectMapper();
            JsonNode data = response.get("data");

            String id = data.get("id").asText();
            Optional<Payment> existingPayment = paymentRepository.findById(id);

            if (existingPayment.isPresent()) {
                // Nếu thanh toán đã tồn tại, cập nhật thông tin
                Payment payment = existingPayment.get();
                payment.setStatus(data.get("status").asText());
                payment.setAmountRemaining(data.get("amountRemaining").asDouble());

                // Nếu cần, cập nhật thêm các cột khác
                paymentRepository.save(payment);
                System.out.println("Cập nhật thông tin thanh toán với ID " + id + " thành công.");
            } else {
                // Nếu thanh toán chưa tồn tại, tạo mới
                Payment payment = new Payment();
                payment.setId(id);
                payment.setOrderCode(data.get("orderCode").asLong());
                payment.setAmount(data.get("amount").asDouble());
                payment.setAmountRemaining(data.get("amountRemaining").asDouble());
                payment.setStatus(data.get("status").asText());
                payment.setCreatedAt(mapper.convertValue(data.get("createdAt"), Date.class));

                paymentRepository.save(payment);

                System.out.println("Thông tin thanh toán đã được lưu thành công.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void saveInvoice(ObjectNode response, String orderId) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode data = response.get("data");

            Invoice invoice = new Invoice();
            invoice.setShippingFee(25000.0);
            invoice.setTotalAmount(data.get("amount").asDouble());
            invoice.setStatus(InvoiceStatus.valueOf(data.get("status").asText()));
            invoice.setPaymentMethod(PaymentMethod.BANK);
            invoice.setCreatedAt(mapper.convertValue(data.get("createdAt"), Date.class));

            Order order = orderRepository.findById(orderId).orElse(null);
            invoice.setDeliveryAddress(order.getDeliveryAddress());
            invoice.setOrder(order);
            invoice.setCustomer(order.getCustomer());
            invoice.setTotalPrice(order.getTotalPrice());
            invoice.setTotalLoyalty(order.getTotalLoyalty());
            invoice.setTotalDiscount(order.getTotalDiscount());

            invoiceRepository.save(invoice);

            Invoice savedInvoice = invoiceRepository.save(invoice);
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

            System.out.println("Thông tin hóa đơn đã được lưu thành công.");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @PostMapping(path = "/create")
    public ObjectNode createPaymentLink(@RequestParam String orderId) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();
        try {
            // Lấy thông tin order dựa vào orderId
            Optional<Order> optionalOrder = orderRepository.findById(orderId);
            if (!optionalOrder.isPresent()) {
                response.put("error", -1);
                response.put("message", "Order not found");
                return response;
            }

            Order order = optionalOrder.get();
            order.setStatus("In Progress");

            // Lấy thông tin sản phẩm từ OrderDetails
            StringBuilder productNames = new StringBuilder();
            int totalQuantity = 0;
            double totalAmount = 0;
            for (OrderDetail detail : order.getOrderDetails()) {
                productNames.append(detail.getProduct().getName()).append(", ");
                totalAmount += detail.getQuantity() * detail.getPrice();
                totalQuantity += detail.getQuantity();
            }

            // Cắt bỏ dấu phẩy cuối cùng trong chuỗi tên sản phẩm
            if (productNames.length() > 0) {
                productNames.setLength(productNames.length() - 2);
            }

            final String returnUrl = "http://localhost:8080/success";
            final String cancelUrl = "http://localhost:8080/cancel";

            // Tạo đối tượng ItemData
            ItemData item = ItemData.builder()
                    .name(productNames.toString())
                    .price((int)
                            (totalAmount + order.getShippingFee() - order.getTotalDiscount() - order.getTotalLoyalty()))
                    .quantity(totalQuantity)
                    .build();

            String currentTimeString = String.valueOf(String.valueOf(new Date().getTime()));
            long orderCode = Long.parseLong(currentTimeString.substring(currentTimeString.length() - 6));

            PaymentData paymentData = PaymentData.builder()
                    .orderCode(orderCode)
                    .description("OrderCode# " + orderCode)
                    .amount((int)
                            (totalAmount + order.getShippingFee() - order.getTotalDiscount() - order.getTotalLoyalty()))
                    .item(item)
                    .returnUrl(returnUrl)
                    .cancelUrl(cancelUrl)
                    .build();

            // Gọi API tạo liên kết thanh toán
            CheckoutResponseData data = payOS.createPaymentLink(paymentData);

            // Trả về phản hồi thành công
            response.put("code", 1000);
            response.put("message", "success");
            response.set("data", objectMapper.valueToTree(data));
            return response;

        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", -1);
            response.put("message", "fail");
            response.set("data", null);
            return response;
        }
    }

    @GetMapping
    public ObjectNode getOrderById(@RequestParam Long orderCode, @RequestParam String orderId) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();

        try {
            PaymentLinkData order = payOS.getPaymentLinkInformation(orderCode);

            response.set("data", objectMapper.valueToTree(order));
            response.put("error", 0);
            response.put("message", "ok");

            savePayment(response);

            JsonNode data = response.get("data");
            if (data.get("status").asText().equals("PAID")) {
                saveInvoice(response, orderId);
                Invoice invoice = invoiceRepository
                        .findByOrder_OrderId(orderId)
                        .orElseThrow(() -> new RuntimeException("Invoice not found"));
                Order newOrder =
                        orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
                newOrder.setStatus("Completed");
                String email = newOrder.getCustomer().getEmail();
                try {
                    invoiceProcessingService.processInvoice(invoice, email);
                } catch (Exception e) {
                    System.err.println("Error processing invoice: " + e.getMessage());
                    e.printStackTrace();
                }
                List<OrderDetail> details = orderDetailRepository.findByOrderOrderId(orderId);
                for (OrderDetail detail : details) {
                    detail.getProduct().setQuantitySold(detail.getQuantity());
                    detail.getProduct().setStockQuantity(detail.getProduct().getStockQuantity() - detail.getQuantity());
                }
                loyaltyService.addPoints(invoice.getCustomer().getCustomerId(), invoice.getTotalAmount());
            }
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", -1);
            response.put("message", e.getMessage());
            response.set("data", null);
            return response;
        }
    }

    @PutMapping(path = "/{orderId}")
    public ObjectNode cancelOrder(@PathVariable("orderId") int orderId) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();
        try {
            PaymentLinkData order = payOS.cancelPaymentLink(orderId, null);
            response.set("data", objectMapper.valueToTree(order));
            response.put("error", 0);
            response.put("message", "ok");
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", -1);
            response.put("message", e.getMessage());
            response.set("data", null);
            return response;
        }
    }

    @PostMapping(path = "/confirm-webhook")
    public ObjectNode confirmWebhook(@RequestBody Map<String, String> requestBody) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode response = objectMapper.createObjectNode();
        try {
            String str = payOS.confirmWebhook(requestBody.get("webhookUrl"));
            response.set("data", objectMapper.valueToTree(str));
            response.put("error", 0);
            response.put("message", "ok");
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", -1);
            response.put("message", e.getMessage());
            response.set("data", null);
            return response;
        }
    }
}
