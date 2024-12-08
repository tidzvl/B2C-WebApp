package com.Phong.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Phong.backend.dto.response.ApiResponse;
import com.Phong.backend.dto.response.Cart.CartItemResponse;
import com.Phong.backend.entity.cart.Cart;
import com.Phong.backend.entity.cart.CartItem;
import com.Phong.backend.entity.customer.Customer;
import com.Phong.backend.entity.product.Product;
import com.Phong.backend.repository.CartItemRepository;
import com.Phong.backend.repository.CartRepository;
import com.Phong.backend.repository.CustomerRepository;
import com.Phong.backend.repository.ProductRepository;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CustomerRepository customerRepository;

    // Thêm sản phẩm vào giỏ hàng
    public ApiResponse<Cart> addProductToCart(Long customerId, Long productId, int quantity) {
        Optional<Customer> customerOpt = customerRepository.findById(customerId);

        if (quantity <= 0) {
            return ApiResponse.<Cart>builder()
                    .code(400)
                    .message("Quantity must be greater than zero")
                    .build();
        }

        if (!customerOpt.isPresent()) {
            return ApiResponse.<Cart>builder()
                    .code(404)
                    .message("Customer not found")
                    .build();
        }

        Customer customer = customerOpt.get();
        Optional<Product> productOpt = productRepository.findById(productId);
        if (!productOpt.isPresent()) {
            return ApiResponse.<Cart>builder()
                    .code(404)
                    .message("Product not found")
                    .build();
        }

        Product product = productOpt.get();

        // Lấy giỏ hàng của khách hàng
        Optional<Cart> cartOpt = cartRepository.findByCustomer_CustomerId(customer.getCustomerId());
        Cart cart;
        if (cartOpt.isPresent()) {
            cart = cartOpt.get();
        } else {
            // Nếu giỏ hàng chưa tồn tại, tạo mới giỏ hàng
            cart = new Cart();
            cart.setCustomer(customer);
            cart.setTotalPrice(0.0);
        }

        // Kiểm tra nếu sản phẩm đã có trong giỏ hàng
        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartAndProduct(cart, product);
        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + quantity); // Cập nhật số lượng
            existingItem.setTotalPrice(existingItem.getQuantity() * product.getPrice());
            cartItemRepository.save(existingItem);
        } else {
            // Nếu sản phẩm chưa có trong giỏ hàng, tạo mới CartItem
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setTotalPrice(product.getPrice() * quantity);
            cart.getItems().add(cartItem);
            cartItemRepository.save(cartItem);
        }

        // Tính lại tổng giá trị giỏ hàng
        double totalPrice =
                cart.getItems().stream().mapToDouble(CartItem::getTotalPrice).sum();
        cart.setTotalPrice(totalPrice);

        cartRepository.save(cart); // Lưu giỏ hàng

        return ApiResponse.<Cart>builder()
                .message("Product added to cart successfully")
                .result(cart)
                .build();
    }

    @Transactional
    public ApiResponse<Void> removeProductFromCart(Long cartId, Long productId) {
        Optional<Cart> optionalCart = cartRepository.findById(cartId);
        if (optionalCart.isPresent()) {
            Cart cart = optionalCart.get();
            Optional<CartItem> optionalCartItem = cart.getItems().stream()
                    .filter(item -> item.getProduct().getProductId().equals(productId))
                    .findFirst();

            if (optionalCartItem.isPresent()) {
                CartItem cartItem = optionalCartItem.get();
                cart.getItems().remove(cartItem);
                cart.setTotalPrice(cart.getTotalPrice() - cartItem.getTotalPrice());
                cartItemRepository.delete(cartItem);
                cartRepository.save(cart);

                return ApiResponse.<Void>builder()
                        .message("Product removed from cart successfully")
                        .build();
            } else {
                return ApiResponse.<Void>builder()
                        .code(404)
                        .message("Product not found in the cart")
                        .build();
            }
        } else {
            return ApiResponse.<Void>builder()
                    .code(404)
                    .message("Cart not found")
                    .build();
        }
    }

    /**
     * Lấy tất cả sản phẩm trong giỏ hàng.
     */
    public ApiResponse<List<CartItemResponse>> getAllProductsInCart(Long customerId) {
        Cart cart = cartRepository.findByCustomer_CustomerId(customerId).orElse(null);
        if (cart != null) {
            List<CartItemResponse> cartItems =
                    cart.getItems().stream().map(this::mapToCartItemResponse).collect(Collectors.toList());

            return ApiResponse.<List<CartItemResponse>>builder()
                    .message("Products retrieved successfully")
                    .result(cartItems)
                    .build();
        } else {
            return ApiResponse.<List<CartItemResponse>>builder()
                    .code(404)
                    .message("Cart not found")
                    .build();
        }
    }

    @Transactional
    public ApiResponse<Cart> updateProductQuantityInCart(Long cartId, Long productId, int newQuantity) {
        if (newQuantity <= 0) {
            return ApiResponse.<Cart>builder()
                    .code(400)
                    .message("Quantity must be greater than zero")
                    .build();
        }

        // Lấy giỏ hàng
        Optional<Cart> optionalCart = cartRepository.findById(cartId);
        if (!optionalCart.isPresent()) {
            return ApiResponse.<Cart>builder()
                    .code(404)
                    .message("Cart not found")
                    .build();
        }

        Cart cart = optionalCart.get();

        // Tìm sản phẩm trong giỏ hàng
        Optional<CartItem> optionalCartItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getProductId().equals(productId))
                .findFirst();

        if (!optionalCartItem.isPresent()) {
            return ApiResponse.<Cart>builder()
                    .code(404)
                    .message("Product not found in the cart")
                    .build();
        }

        // Cập nhật số lượng và tính lại tổng giá sản phẩm
        CartItem cartItem = optionalCartItem.get();
        cartItem.setQuantity(newQuantity);
        cartItem.setTotalPrice(newQuantity * cartItem.getProduct().getPrice());
        cartItemRepository.save(cartItem);

        // Tính lại tổng giá trị giỏ hàng
        double totalPrice =
                cart.getItems().stream().mapToDouble(CartItem::getTotalPrice).sum();
        cart.setTotalPrice(totalPrice);
        cartRepository.save(cart);

        return ApiResponse.<Cart>builder()
                .message("Cart updated successfully")
                .result(cart)
                .build();
    }

    /**
     * Helper: Chuyển CartItem thành CartItemResponse.
     */
    private CartItemResponse mapToCartItemResponse(CartItem cartItem) {
        return CartItemResponse.builder()
                .cartItemId(cartItem.getCartItemId())
                .productId(cartItem.getProduct().getProductId())
                .productName(cartItem.getProduct().getName())
                .quantity(cartItem.getQuantity())
                .totalPrice(cartItem.getTotalPrice())
                .build();
    }
}
