package com.Phong.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Phong.backend.entity.order.OrderDetail;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {

    // Tìm tất cả OrderDetails theo orderId
    List<OrderDetail> findByOrderOrderId(String orderId);

    // Tìm tất cả OrderDetails theo productId (nếu cần thiết)
    List<OrderDetail> findByProductProductId(Long productId);
}
