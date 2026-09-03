package com.restaurant.pos.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.pos.dto.AddOrderItemRequest;
import com.restaurant.pos.dto.CreateOrderRequest;
import com.restaurant.pos.dto.OrderDTO;
import com.restaurant.pos.dto.UpdateOrderItemRequest;
import com.restaurant.pos.enums.OrderStatus;
import com.restaurant.pos.service.CurrentEmployeeService;
import com.restaurant.pos.service.OrderService;
import com.restaurant.pos.service.TableService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
private final OrderService orderService;
private final TableService tableService;
private final CurrentEmployeeService currentEmployeeService;
public OrderController(OrderService orderService,TableService tableService,CurrentEmployeeService currentEmployeeService) {
	this.orderService=orderService;
	this.tableService=tableService;
	this.currentEmployeeService=currentEmployeeService;
}
@GetMapping
public ResponseEntity<List<OrderDTO>> findAll(){
	return ResponseEntity.ok(orderService.findAll());
}
@GetMapping("/{orderId}")
public ResponseEntity<OrderDTO> findById(@PathVariable Long orderId){
	return ResponseEntity.ok(orderService.findById(orderId));
}
@GetMapping("/status/{status}")
public ResponseEntity<List<OrderDTO>> findByStatus(@PathVariable OrderStatus status){
	return ResponseEntity.ok(orderService.findByStatus(status));
}
@GetMapping("/date/{date}")
public ResponseEntity<List<OrderDTO>> findByDate( @PathVariable@DateTimeFormat
                                                (iso=DateTimeFormat.ISO.DATE)LocalDate date){
	return ResponseEntity.ok(orderService.findByDate(date));
}
@PostMapping("/{orderId}/items")
public ResponseEntity<OrderDTO> addItem(@PathVariable Long orderId
		                               ,@Valid@RequestBody AddOrderItemRequest request){
	return ResponseEntity.ok(orderService.addItem(orderId, request));
}
@PutMapping("/{orderId}/items/{itemId}")
public ResponseEntity<OrderDTO> updateItemQuantity(@PathVariable Long orderId,
		                                           @PathVariable Long itemId,
		                                           @Valid @RequestBody UpdateOrderItemRequest request){
	return ResponseEntity.ok(orderService.updateItemQuantity(orderId, itemId, request.getQuantity()));
}
@DeleteMapping("/{orderId}/items/{itemId}")
public ResponseEntity<OrderDTO> removeItem(@PathVariable Long orderId,@PathVariable Long itemId){
	return ResponseEntity.ok(orderService.removeItem(orderId,itemId));
}
@PostMapping
public ResponseEntity<OrderDTO>createOrder(@Valid@RequestBody CreateOrderRequest request){
	Long employeeId=currentEmployeeService.getCurrentEmployeeId();
	OrderDTO order=tableService.openTable(request.getTableNo(),employeeId);
	return ResponseEntity.ok(order);
}
@PutMapping("/{orderId}/cancel")
public ResponseEntity<OrderDTO>cancelOrder(@PathVariable Long orderId){
	return ResponseEntity.ok(orderService.cancelOrder(orderId));
}
}
