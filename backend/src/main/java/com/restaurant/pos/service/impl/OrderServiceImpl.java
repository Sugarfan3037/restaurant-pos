package com.restaurant.pos.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import com.restaurant.pos.entity.RestaurantTable;
import com.restaurant.pos.enums.TableStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.restaurant.pos.dto.AddOrderItemRequest;
import com.restaurant.pos.dto.OrderDTO;
import com.restaurant.pos.dto.OrderItemDTO;
import com.restaurant.pos.entity.MenuItem;
import com.restaurant.pos.entity.Order;
import com.restaurant.pos.entity.OrderItem;
import com.restaurant.pos.enums.OrderStatus;
import com.restaurant.pos.exception.BusinessException;
import com.restaurant.pos.exception.ResourceNotFoundException;
import com.restaurant.pos.repository.MenuItemRepository;
import com.restaurant.pos.repository.OrderRepository;
import com.restaurant.pos.service.OrderService;
@Service
public class OrderServiceImpl implements OrderService{
private final OrderRepository orderRepository;	
private final MenuItemRepository menuItemRepository;
public OrderServiceImpl(
OrderRepository orderRepository,
MenuItemRepository menuItemRepository) {

this.orderRepository = orderRepository;
this.menuItemRepository = menuItemRepository;
}

	@Override
	@Transactional
	public OrderDTO addItem(Long orderId, AddOrderItemRequest request) {
	Order order=orderRepository.findById(orderId).orElseThrow(
				    ()->new ResourceNotFoundException("找不到訂單,id="+orderId));
		if(order.getStatus()!=OrderStatus.OPEN) {
			throw new BusinessException("此訂單不是OPEN狀態，無法新增餐點");
		}
		
	MenuItem menuItem=menuItemRepository.findById(request.getMenuItemId())
			          .orElseThrow(()->new ResourceNotFoundException(
			          "找不到餐點,id="+request.getMenuItemId()));
	    if(!Boolean.TRUE.equals(menuItem.getAvailable())) {
	    	throw new BusinessException("此餐點目前已下架,無法點餐");
	    }
	    
	BigDecimal unitPrice=menuItem.getPrice();
	
	BigDecimal subtotal=unitPrice.multiply(
			            BigDecimal.valueOf(request.getQuantity()));
	
	OrderItem item=new OrderItem();
	item.setMenuItem(menuItem);
	item.setQuantity(request.getQuantity());
	item.setUnitPrice(unitPrice);
	item.setSubtotal(subtotal);
	item.setSugarLevel(request.getSugarLevel());
	item.setIceLevel(request.getIceLevel());
	item.setNote(request.getNote());
	order.addItem(item);
	recalculateTotal(order);
	Order saved=orderRepository.save(order);
	return toOrderDTO(saved);
	}
	

	@Override
	@Transactional(readOnly=true)
	public OrderDTO findById(Long orderId) {
		Order order=orderRepository.findById(orderId).orElseThrow(
				    ()->new ResourceNotFoundException("找不到訂單,id="+orderId));
		return toOrderDTO(order);
	}
private void recalculateTotal(Order order) {
	BigDecimal total=
			order.getItems().stream().map(OrderItem::getSubtotal)
			.reduce(BigDecimal.ZERO,BigDecimal::add);
	order.setTotalAmount(total);
}
private OrderDTO toOrderDTO(Order order) {
	List<OrderItemDTO> items=order.getItems().stream().map(this::toOrderItemDTO)
			                 .toList();
	return new OrderDTO(
			order.getId(),
			order.getRestaurantTable().getTableNumber(),
			order.getEmployee().getId(),
			order.getEmployee().getName(),
			order.getStatus(),
			order.getTotalAmount(),
			order.getCreatedAt(),
			items
			);
}
private OrderItemDTO toOrderItemDTO(OrderItem item) {

	return new OrderItemDTO(
	        item.getId(),
	        item.getMenuItem().getId(),
	        item.getMenuItem().getName(),
	        item.getQuantity(),
	        item.getUnitPrice(),
	        item.getSubtotal(),
	        item.getSugarLevel(),
	        item.getIceLevel(),
	        item.getNote()
	        );
}

@Override
@Transactional
public OrderDTO updateItemQuantity(Long orderId, Long itemId, Integer quantity) {
	if(quantity==null||quantity<1) {
		throw new BusinessException("餐點數量至少必須為1");
	}
	Order order=orderRepository.findById(orderId).orElseThrow(
			    ()->new ResourceNotFoundException(
			    "找不到訂單,id="+orderId)
			);
	if(order.getStatus()!=OrderStatus.OPEN) {
		throw new BusinessException("此訂單不是 OPEN 狀態，無法修改餐點");
	}
	OrderItem item=order.getItems().stream().filter(orderItem->orderItem.getId().equals(itemId))
			       .findFirst().orElseThrow(()->new ResourceNotFoundException("找不到訂單明細,id="+itemId));
	item.setQuantity(quantity);
	BigDecimal subtotal=item.getUnitPrice().multiply(BigDecimal.valueOf(quantity));
	item.setSubtotal(subtotal);
	recalculateTotal(order);
	Order saved=orderRepository.save(order);
	return toOrderDTO(saved);
}
@Override
@Transactional
public OrderDTO removeItem(Long orderId, Long itemId) {
	Order order=orderRepository.findById(orderId).orElseThrow(
			    ()->new ResourceNotFoundException("找不到訂單,id="+orderId)
			);
	if(order.getStatus()!=OrderStatus.OPEN) {
		throw new BusinessException("此訂單不是OPEN狀態,無法刪除餐點");
	}
	 OrderItem item =order.getItems().stream().filter
			         (orderItem->orderItem.getId().equals(itemId)
	                    ).findFirst().orElseThrow(
	                 ()->new ResourceNotFoundException("找不到訂單明細，id = " + itemId));
	 order.removeItem(item);
	 recalculateTotal(order);
	 Order saved=orderRepository.save(order);
	 return toOrderDTO(saved);
}

@Override
@Transactional(readOnly = true)
public List<OrderDTO> findAll() {
	return orderRepository.findAll().stream().map(this::toOrderDTO).toList();
}

@Override
@Transactional(readOnly = true)
public List<OrderDTO> findByStatus(OrderStatus status) {
	return orderRepository.findByStatus(status).stream()
		   .map(this::toOrderDTO).toList();
}

@Override
@Transactional(readOnly = true)
public List<OrderDTO> findByDate(LocalDate date) {
	LocalDateTime start=date.atStartOfDay();
	LocalDateTime end=date.plusDays(1).atStartOfDay();
	return orderRepository.findByCreatedAtGreaterThanEqualAndCreatedAtLessThan(start, end)
		   .stream().map(this::toOrderDTO).toList();
}

@Override
@Transactional
public OrderDTO cancelOrder(Long orderId) {
	Order order=orderRepository.findById(orderId).orElseThrow(
			              ()->new ResourceNotFoundException("找不到訂單,id="+orderId));
	if(order.getStatus()!=OrderStatus.OPEN) {
		throw new BusinessException("只有 OPEN 狀態的訂單可以取消");
	}
	order.setStatus(OrderStatus.CANCELLED);
	order.setUpdatedAt(LocalDateTime.now());
	RestaurantTable table=order.getRestaurantTable();
	table.setStatus(TableStatus.AVAILABLE);
	Order saved=orderRepository.save(order);
	return toOrderDTO(saved);
}
}
