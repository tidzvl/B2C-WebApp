package com.Phong.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Phong.backend.entity.employee.Seller;

@Repository
public interface SalesPersonRepository extends JpaRepository<Seller, Long> {}
