package com.Phong.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Phong.backend.dto.request.product.CategoryRequest;
import com.Phong.backend.dto.response.ApiResponse;
import com.Phong.backend.dto.response.product.CategoryResponse;
import com.Phong.backend.entity.product.Category;
import com.Phong.backend.entity.product.Product;
import com.Phong.backend.repository.CategoryRepository;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Create Category
    @Transactional
    public ApiResponse<CategoryResponse> createCategory(CategoryRequest categoryRequest) {
        Category category = Category.builder()
                .name(categoryRequest.getName())
                .description(categoryRequest.getDescription())
                .build();

        Category savedCategory = categoryRepository.save(category);

        CategoryResponse response = mapToCategoryResponse(savedCategory);
        return ApiResponse.<CategoryResponse>builder()
                .message("Category created successfully")
                .result(response)
                .build();
    }

    // Update Category (PATCH)
    @Transactional
    public ApiResponse<CategoryResponse> updateCategory(Long categoryId, CategoryRequest categoryRequest) {
        Optional<Category> existingCategory = categoryRepository.findById(categoryId);
        if (existingCategory.isPresent()) {
            Category updatedCategory = existingCategory.get();
            if (categoryRequest.getName() != null) updatedCategory.setName(categoryRequest.getName());
            if (categoryRequest.getDescription() != null)
                updatedCategory.setDescription(categoryRequest.getDescription());
            Category savedCategory = categoryRepository.save(updatedCategory);

            CategoryResponse response = mapToCategoryResponse(savedCategory);
            return ApiResponse.<CategoryResponse>builder()
                    .message("Category updated successfully")
                    .result(response)
                    .build();
        } else {
            return ApiResponse.<CategoryResponse>builder()
                    .code(404)
                    .message("Category not found")
                    .build();
        }
    }

    // Delete Category
    @Transactional
    public ApiResponse<Void> deleteCategory(Long categoryId) {
        Optional<Category> existingCategory = categoryRepository.findById(categoryId);
        if (existingCategory.isPresent()) {
            categoryRepository.delete(existingCategory.get());
            return ApiResponse.<Void>builder()
                    .message("Category deleted successfully")
                    .build();
        } else {
            return ApiResponse.<Void>builder()
                    .code(404)
                    .message("Category not found")
                    .build();
        }
    }

    // Get all Categories
    public ApiResponse<List<CategoryResponse>> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        List<CategoryResponse> categoryResponses =
                categories.stream().map(this::mapToCategoryResponse).collect(Collectors.toList());
        return ApiResponse.<List<CategoryResponse>>builder()
                .message("Categories retrieved successfully")
                .result(categoryResponses)
                .build();
    }

    // Get Category by Id
    public ApiResponse<CategoryResponse> getCategoryById(Long categoryId) {
        Optional<Category> category = categoryRepository.findById(categoryId);
        return category.map(c -> ApiResponse.<CategoryResponse>builder()
                        .message("Category found")
                        .result(mapToCategoryResponse(c))
                        .build())
                .orElseGet(() -> ApiResponse.<CategoryResponse>builder()
                        .code(404)
                        .message("Category not found")
                        .build());
    }

    // Helper method to map Category to CategoryResponse
    public CategoryResponse mapToCategoryResponse(Category category) {
        List<Product> products = category.getProducts();

        if (products == null) {
            products = new ArrayList<>();
        }

        List<String> productNames = products.stream().map(Product::getName).collect(Collectors.toList());

        return CategoryResponse.builder()
                .categoryId(category.getCategoryId())
                .name(category.getName())
                .description(category.getDescription())
                .productNames(productNames)
                .build();
    }
}
