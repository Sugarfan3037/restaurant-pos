package com.restaurant.pos.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Data;
@Data
public class DailyClosingDTO {
private Long id;
private LocalDate closingDate;
private Integer totalOrders;
private BigDecimal totalRevenue;
private BigDecimal cashAmount;
private BigDecimal cardAmount;
private BigDecimal otherAmount;
private Long employeeId;
private String employeeName;
private LocalDateTime closedAt;

public DailyClosingDTO() {};

public DailyClosingDTO(Long id,LocalDate closingDate,Integer totalOrders,BigDecimal totalRevenue
		                                  ,BigDecimal cashAmount,BigDecimal cardAmount,BigDecimal otherAmount
		                                  ,Long employeeId,String employeeName,LocalDateTime closedAt) {
	this.id = id;
    this.closingDate = closingDate;
    this.totalOrders = totalOrders;
    this.totalRevenue = totalRevenue;
    this.cashAmount = cashAmount;
    this.cardAmount = cardAmount;
    this.otherAmount = otherAmount;
    this.employeeId = employeeId;
    this.employeeName = employeeName;
    this.closedAt = closedAt;
}
}
