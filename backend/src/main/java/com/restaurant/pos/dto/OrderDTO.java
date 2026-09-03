package com.restaurant.pos.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.restaurant.pos.enums.OrderStatus;

import lombok.Data;
@Data
public class OrderDTO {
private Long id;
private Integer tableNumber;
private Long employeeId;
private String employeeName;
private OrderStatus status;
private BigDecimal totalAmount;
private LocalDateTime createdAt;
private List<OrderItemDTO> items;

public OrderDTO() {}

public OrderDTO(
Long id,
Integer tableNumber,
Long employeeId,
String employeeName,
OrderStatus status,
BigDecimal totalAmount,
LocalDateTime createdAt,
List<OrderItemDTO> items) {
this.id = id;
this.tableNumber = tableNumber;
this.employeeId = employeeId;
this.employeeName = employeeName;
this.status = status;
this.totalAmount = totalAmount;
this.createdAt = createdAt;
this.items=items;
	    }
public OrderDTO(
        Long id,
        Integer tableNumber,
        Long employeeId,
        String employeeName,
        OrderStatus status,
        BigDecimal totalAmount,
        LocalDateTime createdAt) {

    this.id = id;
    this.tableNumber = tableNumber;
    this.employeeId = employeeId;
    this.employeeName = employeeName;
    this.status = status;
    this.totalAmount = totalAmount;
    this.createdAt = createdAt;
    this.items = List.of();
}
}
