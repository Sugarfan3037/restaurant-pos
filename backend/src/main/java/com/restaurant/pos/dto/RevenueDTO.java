package com.restaurant.pos.dto;

import java.math.BigDecimal;

import lombok.Data;
@Data
public class RevenueDTO {
private String period;
private Long totalOrders;
private BigDecimal totalRevenue;
private BigDecimal cashAmount;
private BigDecimal cardAmount;
private BigDecimal linePayAmount;

public RevenueDTO(){}
public RevenueDTO(String period,Long totalOrders,BigDecimal totalRevenue,BigDecimal cashAmount
		                          ,BigDecimal cardAmount,BigDecimal linePayAmount){
	this.period=period;
	this.totalOrders=totalOrders;
	this.totalRevenue=totalRevenue;
	this.cashAmount=cashAmount;
	this.cardAmount=cardAmount;
	this.linePayAmount=linePayAmount;
	
}
}
