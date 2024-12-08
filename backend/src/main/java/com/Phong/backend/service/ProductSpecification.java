package com.Phong.backend.service;

import org.springframework.data.jpa.domain.Specification;

import com.Phong.backend.entity.product.Product;

public class ProductSpecification {

    public static Specification<Product> hasCategory(String categoryName) {
        return (root, query, cb) -> cb.equal(root.get("category").get("name"), categoryName);
    }

    public static Specification<Product> hasVersion(String version) {
        return (root, query, cb) -> cb.equal(root.get("version"), version);
    }

    public static Specification<Product> hasOrigin(String origin) {
        return (root, query, cb) -> cb.equal(root.get("origin"), origin);
    }

    public static Specification<Product> priceLessThan(double maxPrice) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("price"), maxPrice);
    }
}
