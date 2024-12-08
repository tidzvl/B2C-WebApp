package com.Phong.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Phong.backend.dto.request.product.DiscountRequest;
import com.Phong.backend.dto.response.ApiResponse;
import com.Phong.backend.dto.response.product.DiscountResponse;
import com.Phong.backend.entity.product.Category;
import com.Phong.backend.entity.product.Discount;
import com.Phong.backend.entity.product.Product;
import com.Phong.backend.repository.CategoryRepository;
import com.Phong.backend.repository.DiscountRepository;
import com.Phong.backend.repository.ProductRepository;

@Service
public class DiscountService {
    @Autowired
    private DiscountRepository discountRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public ApiResponse<DiscountResponse> createDiscount(DiscountRequest request) {
        Discount discount = new Discount();
        discount.setName(request.getName());
        discount.setDescription(request.getDescription());
        discount.setDiscountValue(request.getDiscountValue());
        discount.setStartDate(request.getStartDate());
        discount.setEndDate(request.getEndDate());

        List<Product> products = new ArrayList<>();

        if (request.isApplyToAll()) {
            discount.setProducts(new ArrayList<>(productRepository.findAll()));
        } else if (request.getCategoryId() != null) {
            Category category = categoryRepository
                    .findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            discount.setProducts(new ArrayList<>(category.getProducts()));
        } else if (!request.getProductIds().isEmpty()) {
            products = new ArrayList<>(productRepository.findAllById(request.getProductIds()));
            products.forEach(product -> product.setDiscounts(null)); // Hoặc xử lý detach đúng cách
            discount.setProducts(products);
        }

        productRepository.saveAll(products);
        discountRepository.save(discount);

        productRepository.saveAll(products); // Lưu lại các sản phẩm sau khi cập nhật
        discountRepository.save(discount); // Lưu discount

        return ApiResponse.<DiscountResponse>builder()
                .message("Discount created successfully")
                .result(mapToResponse(discount))
                .build();
    }

    public ApiResponse<DiscountResponse> patchDiscount(Long discountId, DiscountRequest request) {
        // Tìm Discount bằng ID, nếu không có thì báo lỗi
        Discount discount =
                discountRepository.findById(discountId).orElseThrow(() -> new RuntimeException("Discount not found"));

        // Chỉ cập nhật những trường không null
        if (request.getName() != null) {
            discount.setName(request.getName());
        }
        if (request.getDescription() != null) {
            discount.setDescription(request.getDescription());
        }
        if (request.getDiscountValue() != null) {
            discount.setDiscountValue(request.getDiscountValue());
        }
        if (request.getStartDate() != null) {
            discount.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            discount.setEndDate(request.getEndDate());
        }

        // Xử lý logic cập nhật Product hoặc Category nếu cần
        if (Boolean.TRUE.equals(request.isApplyToAll())) {
            discount.setProducts(new ArrayList<>(productRepository.findAll()));
        } else if (request.getCategoryId() != null) {
            Category category = categoryRepository
                    .findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            discount.setProducts(new ArrayList<>(category.getProducts()));
        } else if (request.getProductIds() != null && !request.getProductIds().isEmpty()) {
            List<Product> products = new ArrayList<>(productRepository.findAllById(request.getProductIds()));
            products.forEach(product -> product.setDiscounts(null)); // Hoặc xử lý detach đúng cách
            discount.setProducts(products);
        }

        // Lưu các thay đổi
        discountRepository.save(discount);

        // Trả về phản hồi
        return ApiResponse.<DiscountResponse>builder()
                .message("Discount patched successfully")
                .result(mapToResponse(discount))
                .build();
    }

    public ApiResponse<String> deleteDiscount(Long discountId) {
        Discount discount =
                discountRepository.findById(discountId).orElseThrow(() -> new RuntimeException("Discount not found"));

        discountRepository.delete(discount);
        return ApiResponse.<String>builder()
                .message("Discount deleted successfully")
                .result("Success")
                .build();
    }

    public ApiResponse<List<String>> getDiscountsForProduct(Long productId) {
        Product product = productRepository
                .findByIdWithDiscounts(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        List<String> discountNames =
                product.getDiscounts().stream().map(Discount::getName).collect(Collectors.toList());

        return ApiResponse.<List<String>>builder()
                .message("Successfully fetched applicable discounts")
                .result(discountNames)
                .build();
    }

    public ApiResponse<List<DiscountResponse>> getAllDiscounts() {
        List<Discount> discounts = discountRepository.findAll();

        List<DiscountResponse> discountResponses =
                discounts.stream().map(this::mapToResponse).toList();

        return ApiResponse.<List<DiscountResponse>>builder()
                .message("Fetched all discounts successfully")
                .result(discountResponses)
                .build();
    }

    private DiscountResponse mapToResponse(Discount discount) {
        List<String> productNames =
                discount.getProducts().stream().map(Product::getName).collect(Collectors.toList());

        return DiscountResponse.builder()
                .discountId(discount.getDiscountId())
                .name(discount.getName())
                .description(discount.getDescription())
                .discountValue(discount.getDiscountValue())
                .startDate(discount.getStartDate().toString())
                .endDate(discount.getEndDate().toString())
                .productNames(productNames)
                .build();
    }
}
