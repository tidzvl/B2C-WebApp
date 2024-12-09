package com.Phong.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Phong.backend.dto.request.order.OrderRequest;
import com.Phong.backend.dto.response.ApiResponse;
import com.Phong.backend.entity.cart.Cart;
import com.Phong.backend.entity.cart.CartItem;
import com.Phong.backend.entity.customer.Address;
import com.Phong.backend.entity.customer.Customer;
import com.Phong.backend.entity.order.Order;
import com.Phong.backend.entity.order.OrderDetail;
import com.Phong.backend.entity.product.Discount;
import com.Phong.backend.repository.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private DiscountRepository discountRepository;

    @Transactional
    public Order createOrderFromCart(
            Long customerId,
            Long addressId,
            List<OrderRequest.CartItemDiscountRequest> cartItems,
            Boolean isUseLoyalty) {
        // Lấy giỏ hàng của khách hàng
        Cart cart = cartRepository
                .findByCustomer_CustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("Cart not found for customer"));

        // Lấy các CartItem từ cart
        List<CartItem> selectedCartItems = cartItemRepository.findAllById(cartItems.stream()
                .map(OrderRequest.CartItemDiscountRequest::getCartItemId)
                .collect(Collectors.toList()));

        if (selectedCartItems.isEmpty()) {
            throw new RuntimeException("No items selected for order");
        }

        // Lấy địa chỉ giao hàng
        Address deliveryAddress = cart.getCustomer().getAddresses().stream()
                .filter(address -> address.getAddressId().equals(addressId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Delivery address not found for customer"));

        // Tạo đơn hàng mới từ các CartItem đã chọn
        Order order = new Order();
        order.setCustomer(cart.getCustomer());
        order.setShippingFee(25000.0);
        order.setDeliveryAddress(deliveryAddress);
        order.setOrderDate(java.time.LocalDateTime.now());
        order.setStatus("Not Started");
        order.setDeliveryDate(java.time.LocalDateTime.now().plusDays(3));

        double totalPrice = 0;
        double totalDiscount = 0;

        for (int i = 0; i < selectedCartItems.size(); i++) {
            CartItem cartItem = selectedCartItems.get(i);

            if (cartItem.getProduct().getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: "
                        + cartItem.getProduct().getName());
            }

            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(order);
            orderDetail.setProduct(cartItem.getProduct());
            orderDetail.setQuantity(cartItem.getQuantity());
            orderDetail.setPrice(cartItem.getProduct().getPrice());
            totalPrice += orderDetail.getPrice() * orderDetail.getQuantity();
            order.getOrderDetails().add(orderDetail);

            Long discountId = cartItems.get(i).getDiscountId();
            if (discountId != null) {
                Discount discount = discountRepository
                        .findById(discountId)
                        .orElseThrow(() -> new RuntimeException("Discount not found"));
                if (discount.getEndDate().isBefore(LocalDateTime.now())) {
                    throw new RuntimeException("Discount has expired");
                }

                if (cartItem.getProduct().getDiscounts().contains(discount)) {
                    double discountedPrice =
                            orderDetail.getPrice() * orderDetail.getQuantity() * (discount.getDiscountValue() / 100.0);
                    totalDiscount += discountedPrice;
                } else {
                    throw new RuntimeException("Discount not applicable for product");
                }
            }
        }

        double totalLoyalty = 0;
        if (isUseLoyalty) {
            Customer customer = customerRepository
                    .findById(customerId)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            if (totalPrice >= customer.getLoyalty().getPoints()) {
                totalLoyalty = totalLoyalty + customer.getLoyalty().getPoints();
                customer.getLoyalty().setPoints(0);
            } else {
                customer.getLoyalty().setPoints((int) (customer.getLoyalty().getPoints() - totalPrice));
                totalLoyalty = totalLoyalty + totalPrice;
                totalPrice = 0.0;
            }
        }

        order.setTotalLoyalty(totalLoyalty);
        order.setTotalDiscount(totalDiscount);
        order.setTotalPrice(totalPrice); // Cập nhật tổng giá trị đơn hàng
        order.setTotalAmount(totalPrice
                + order.getShippingFee()
                - totalDiscount
                - totalLoyalty); // Thêm phí vận chuyển vào tổng giá trị đơn hàng

        // Lưu đơn hàng vào cơ sở dữ liệu
        order = orderRepository.save(order);

        // Sau khi đơn hàng được tạo, xóa các CartItem đã chọn khỏi giỏ hàng
        cart.setTotalPrice(cart.getTotalPrice() - totalPrice);
        cart.getItems().removeAll(selectedCartItems);
        cartRepository.save(cart); // Cập nhật lại giỏ hàng

        // Xóa các CartItem khỏi cơ sở dữ liệu
        cartItemRepository.deleteAll(selectedCartItems);

        return order; // Trả về đơn hàng vừa tạo
    }

    public ApiResponse<List<Order>> getOrdersByCustomer(Long customerId) {
        Optional<Customer> customerOpt = customerRepository.findById(customerId);
        if (!customerOpt.isPresent()) {
            return ApiResponse.<List<Order>>builder()
                    .code(404)
                    .message("Customer not found")
                    .build();
        }

        Customer customer = customerOpt.get();
        List<Order> orders = orderRepository.findByCustomer(customer);

        return ApiResponse.<List<Order>>builder()
                .message("Orders retrieved successfully")
                .result(orders)
                .build();
    }

    public ApiResponse<Order> getOrderDetails(String orderId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (!orderOpt.isPresent()) {
            return ApiResponse.<Order>builder()
                    .code(404)
                    .message("Order not found")
                    .build();
        }

        Order order = orderOpt.get();
        return ApiResponse.<Order>builder()
                .message("Order details retrieved successfully")
                .result(order)
                .build();
    }

    public ApiResponse<Void> cancelOrder(String orderId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (!orderOpt.isPresent()) {
            return ApiResponse.<Void>builder()
                    .code(404)
                    .message("Order not found")
                    .build();
        }

        Order order = orderOpt.get();
        if ("CANCELLED".equals(order.getStatus())) {
            return ApiResponse.<Void>builder()
                    .code(400)
                    .message("Order is already cancelled")
                    .build();
        }

        order.setStatus("CANCELLED");
        orderRepository.save(order);

        return ApiResponse.<Void>builder()
                .message("Order cancelled successfully")
                .build();
    }
}
