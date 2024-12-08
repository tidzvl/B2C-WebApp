package com.Phong.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Phong.backend.entity.customer.Address;
import com.Phong.backend.entity.customer.Customer;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByCustomer(Customer customer);
}
