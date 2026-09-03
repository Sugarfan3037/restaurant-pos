package com.restaurant.pos.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.restaurant.pos.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem,Long>{
	List<OrderItem> findByOrderId(long orderId);

}
