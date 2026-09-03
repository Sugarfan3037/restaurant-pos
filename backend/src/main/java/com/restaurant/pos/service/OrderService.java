package com.restaurant.pos.service;

import java.time.LocalDate;
import java.util.List;

import com.restaurant.pos.dto.AddOrderItemRequest;
import com.restaurant.pos.dto.OrderDTO;
import com.restaurant.pos.enums.OrderStatus;

public interface OrderService {
OrderDTO addItem(Long orderId,AddOrderItemRequest request);
OrderDTO updateItemQuantity(Long orderId,Long itemId,Integer quantity);
OrderDTO removeItem(Long orderId,Long itemId);
OrderDTO findById(Long orderId);
OrderDTO cancelOrder(Long orderId);
List<OrderDTO> findAll();
List<OrderDTO> findByStatus(OrderStatus status);
List<OrderDTO> findByDate(LocalDate date);

}
