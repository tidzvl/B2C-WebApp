package com.Phong.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Phong.backend.entity.customer.Avatar;

public interface AvatarRepository extends JpaRepository<Avatar, Long> {}
