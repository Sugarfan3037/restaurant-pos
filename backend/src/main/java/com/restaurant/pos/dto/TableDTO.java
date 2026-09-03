package com.restaurant.pos.dto;

import com.restaurant.pos.enums.TableStatus;

import lombok.Data;
@Data
public class TableDTO {
private Long id;
private Integer tableNumber;
private Integer capacity;
private TableStatus status;

public TableDTO() {}

public TableDTO(Long id,Integer tableNumber,Integer capacity
		       ,TableStatus status) {
	this.id=id;
	this.tableNumber=tableNumber;
	this.capacity=capacity;
	this.status=status;
}
}