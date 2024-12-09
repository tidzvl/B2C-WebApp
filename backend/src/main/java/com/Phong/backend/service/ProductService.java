package com.Phong.backend.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.Phong.backend.dto.request.product.ProductRequest;
import com.Phong.backend.dto.request.product.ProductUpdateRequest;
import com.Phong.backend.dto.response.ApiResponse;
import com.Phong.backend.dto.response.product.ProductResponse;
import com.Phong.backend.entity.product.Category;
import com.Phong.backend.entity.product.Product;
import com.Phong.backend.entity.product.ProductImage;
import com.Phong.backend.repository.CategoryRepository;
import com.Phong.backend.repository.ProductRepository;

@Service
public class ProductService {
    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // Create Product
    @Transactional
    public ApiResponse<ProductResponse> createProduct(ProductRequest productRequest) {
        Category category = null;
        if (productRequest.getCategoryId() != null) {
            Optional<Category> categoryOptional = categoryRepository.findById(productRequest.getCategoryId());
            if (categoryOptional.isPresent()) {
                category = categoryOptional.get();
            } else {
                return ApiResponse.<ProductResponse>builder()
                        .code(400)
                        .message("Category not found")
                        .build();
            }
        }

        // Tạo sản phẩm với category có thể là null
        Product product = Product.builder()
                .name(productRequest.getName())
                .description(productRequest.getDescription())
                .price(productRequest.getPrice())
                .origin(productRequest.getOrigin())
                .version(productRequest.getVersion())
                .evaluate(productRequest.getEvaluate())
                .images(productRequest.getImages())
                .stockQuantity(productRequest.getStockQuantity())
                .category(category) // category có thể là null
                .quantitySold(0) // Giá trị mặc định
                .build();

        Product savedProduct = productRepository.save(product);

        if (category != null) {
            category.getProducts().add(savedProduct);
            categoryRepository.save(category);
        }

        ProductResponse response = mapToProductResponse(savedProduct);
        return ApiResponse.<ProductResponse>builder()
                .message("Product created successfully")
                .result(response)
                .build();
    }

    // Update Product (PATCH)
    @Transactional
    public ApiResponse<ProductResponse> updateProduct(Long productId, ProductUpdateRequest productUpdateRequest) {
        Optional<Product> existingProduct = productRepository.findById(productId);
        if (existingProduct.isPresent()) {
            Product updatedProduct = existingProduct.get();

            // Cập nhật các trường của product nếu có giá trị mới
            if (productUpdateRequest.getName() != null) updatedProduct.setName(productUpdateRequest.getName());
            if (productUpdateRequest.getDescription() != null)
                updatedProduct.setDescription(productUpdateRequest.getDescription());
            if (productUpdateRequest.getPrice() != null) updatedProduct.setPrice(productUpdateRequest.getPrice());
            if (productUpdateRequest.getOrigin() != null) updatedProduct.setOrigin(productUpdateRequest.getOrigin());
            if (productUpdateRequest.getImages() != null) updatedProduct.setImages(productUpdateRequest.getImages());
            if (productUpdateRequest.getVersion() != null) updatedProduct.setVersion(productUpdateRequest.getVersion());
            if (productUpdateRequest.getEvaluate() != null)
                updatedProduct.setEvaluate(productUpdateRequest.getEvaluate());
            if (productUpdateRequest.getStockQuantity() != null)
                updatedProduct.setStockQuantity(productUpdateRequest.getStockQuantity());

            // Kiểm tra và cập nhật Category nếu categoryId có giá trị
            if (productUpdateRequest.getCategoryId() != null) {
                Optional<Category> category = categoryRepository.findById(productUpdateRequest.getCategoryId());
                if (category.isPresent()) {
                    updatedProduct.setCategory(category.get());
                    if (category.get().getProducts() != null) {
                        category.get().getProducts().add(updatedProduct);
                        categoryRepository.save(category.get());
                    }
                } else {
                    // Nếu không tìm thấy category với id, bạn có thể trả về thông báo lỗi hoặc xử lý theo yêu cầu
                    return ApiResponse.<ProductResponse>builder()
                            .code(404)
                            .message("Category not found")
                            .build();
                }
            }

            // Lưu lại sản phẩm đã cập nhật
            Product savedProduct = productRepository.save(updatedProduct);

            // Chuyển đổi sang ProductResponse và trả kết quả
            ProductResponse response = mapToProductResponse(savedProduct);
            return ApiResponse.<ProductResponse>builder()
                    .message("Product updated successfully")
                    .result(response)
                    .build();
        } else {
            return ApiResponse.<ProductResponse>builder()
                    .code(404)
                    .message("Product not found")
                    .build();
        }
    }

    // Delete Product
    @Transactional
    public ApiResponse<Void> deleteProduct(Long productId) {
        Optional<Product> existingProduct = productRepository.findById(productId);
        if (existingProduct.isPresent()) {
            productRepository.delete(existingProduct.get());
            return ApiResponse.<Void>builder()
                    .message("Product deleted successfully")
                    .build();
        } else {
            return ApiResponse.<Void>builder()
                    .code(404)
                    .message("Product not found")
                    .build();
        }
    }

    // Get all Products in a Category
    public ApiResponse<List<ProductResponse>> getAllProductsByCategory(Long categoryId) {
        Optional<Category> category = categoryRepository.findById(categoryId);
        if (category.isPresent()) {
            List<Product> products = category.get().getProducts();
            List<ProductResponse> productResponses =
                    products.stream().map(this::mapToProductResponse).collect(Collectors.toList());
            return ApiResponse.<List<ProductResponse>>builder()
                    .message("Products retrieved successfully")
                    .result(productResponses)
                    .build();
        } else {
            return ApiResponse.<List<ProductResponse>>builder()
                    .code(404)
                    .message("Category not found")
                    .build();
        }
    }

    // Get Product by Id
    public ApiResponse<ProductResponse> getProductById(Long productId) {
        Optional<Product> product = productRepository.findById(productId);
        return product.map(p -> ApiResponse.<ProductResponse>builder()
                        .message("Product found")
                        .result(mapToProductResponse(p))
                        .build())
                .orElseGet(() -> ApiResponse.<ProductResponse>builder()
                        .code(404)
                        .message("Product not found")
                        .build());
    }

    public ApiResponse<List<ProductResponse>> getAllProducts() {
        // Lấy tất cả sản phẩm từ cơ sở dữ liệu
        List<Product> products = productRepository.findAll();

        // Chuyển đổi các sản phẩm thành ProductResponse
        List<ProductResponse> productResponses =
                products.stream().map(this::mapToProductResponse).collect(Collectors.toList());

        // Trả về ApiResponse với danh sách các sản phẩm
        return ApiResponse.<List<ProductResponse>>builder()
                .message("All products retrieved successfully")
                .result(productResponses)
                .build();
    }

    @Transactional
    public ApiResponse<ProductResponse> addProductToCategory(Long productId, Long categoryId) {
        Optional<Product> productOptional = productRepository.findById(productId);
        if (productOptional.isPresent()) {
            Product product = productOptional.get();

            Optional<Category> categoryOptional = categoryRepository.findById(categoryId);
            if (categoryOptional.isPresent()) {
                Category category = categoryOptional.get();
                // Gán sản phẩm vào danh mục
                product.setCategory(category);

                // Lưu sản phẩm đã được cập nhật
                Product savedProduct = productRepository.save(product);

                // Cập nhật lại danh sách sản phẩm trong danh mục
                category.getProducts().add(savedProduct);
                categoryRepository.save(category);

                // Trả về thông tin sản phẩm đã cập nhật
                ProductResponse response = mapToProductResponse(savedProduct);
                return ApiResponse.<ProductResponse>builder()
                        .message("Product added to category successfully")
                        .result(response)
                        .build();
            } else {
                return ApiResponse.<ProductResponse>builder()
                        .code(404)
                        .message("Category not found")
                        .build();
            }
        } else {
            return ApiResponse.<ProductResponse>builder()
                    .code(404)
                    .message("Product not found")
                    .build();
        }
    }

    @Transactional
    public ApiResponse<ProductResponse> removeProductFromCategory(Long productId) {
        Optional<Product> productOptional = productRepository.findById(productId);
        if (productOptional.isPresent()) {
            Product product = productOptional.get();

            if (product.getCategory() != null) {
                Category category = product.getCategory();
                // Xóa sản phẩm khỏi danh mục
                category.getProducts().remove(product);
                categoryRepository.save(category);

                // Xóa danh mục của sản phẩm
                product.setCategory(null);
                productRepository.save(product);

                // Trả về thông tin sản phẩm đã cập nhật
                ProductResponse response = mapToProductResponse(product);
                return ApiResponse.<ProductResponse>builder()
                        .message("Product removed from category successfully")
                        .result(response)
                        .build();
            } else {
                return ApiResponse.<ProductResponse>builder()
                        .code(404)
                        .message("Product does not belong to any category")
                        .build();
            }
        } else {
            return ApiResponse.<ProductResponse>builder()
                    .code(404)
                    .message("Product not found")
                    .build();
        }
    }

    public ApiResponse<List<ProductResponse>> searchProducts(String keyword) {
        // Tìm kiếm sản phẩm theo tên hoặc mô tả
        List<Product> products = productRepository.findByNameContainingIgnoreCase(keyword);

        // Chuyển đổi sản phẩm thành ProductResponse
        List<ProductResponse> productResponses =
                products.stream().map(this::mapToProductResponse).collect(Collectors.toList());

        if (productResponses.isEmpty()) {
            return ApiResponse.<List<ProductResponse>>builder()
                    .code(404)
                    .message("No products found")
                    .build();
        }

        return ApiResponse.<List<ProductResponse>>builder()
                .message("Products found successfully")
                .result(productResponses)
                .build();
    }

    public Product addProductImage(Long productId, MultipartFile file) throws IOException {
        Product product =
                productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));

        // Upload ảnh lên Cloudinary
        Map uploadResult = cloudinaryService.uploadImage(file);
        String url = (String) uploadResult.get("url");
        String cloudinaryId = (String) uploadResult.get("public_id");

        // Lưu thông tin ảnh vào database
        ProductImage image =
                ProductImage.builder().url(url).cloudinaryId(cloudinaryId).build();

        product.getImages().add(image);
        return productRepository.save(product);
    }

    public List<Product> filterProducts(String category, String version, String origin, Double maxPrice) {
        Specification<Product> spec = Specification.where(null);

        if (category != null && !category.isEmpty()) {
            spec = spec.and(ProductSpecification.hasCategory(category));
        }
        if (version != null && !version.isEmpty()) {
            spec = spec.and(ProductSpecification.hasVersion(version));
        }
        if (origin != null && !origin.isEmpty()) {
            spec = spec.and(ProductSpecification.hasOrigin(origin));
        }
        if (maxPrice != null) {
            spec = spec.and(ProductSpecification.priceLessThan(maxPrice));
        }
        return productRepository.findAll(spec);
    }

    // Helper method to map Product to ProductResponse
    public ProductResponse mapToProductResponse(Product product) {
        return ProductResponse.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .origin(product.getOrigin())
                .version(product.getVersion())
                .images(product.getImages())
                .evaluate(product.getEvaluate())
                .quantitySold(product.getQuantitySold())
                .stockQuantity(product.getStockQuantity())
                .categoryName(
                        product.getCategory() != null ? product.getCategory().getName() : "Unknown")
                .build();
    }
}
