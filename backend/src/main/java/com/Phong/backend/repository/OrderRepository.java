package com.Phong.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Phong.backend.entity.customer.Customer;
import com.Phong.backend.entity.order.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    List<Order> findByCustomer(Customer customer);
}
