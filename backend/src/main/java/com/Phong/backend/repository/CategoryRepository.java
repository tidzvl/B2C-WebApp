package com.Phong.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Phong.backend.entity.product.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {}
