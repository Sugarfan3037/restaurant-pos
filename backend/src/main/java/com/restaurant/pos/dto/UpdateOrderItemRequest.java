package com.restaurant.pos.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateOrderItemRequest {
@NotNull(message = "數量不可為空")
@Min(value = 1, message = "數量至少必須為1")
private Integer quantity;
public UpdateOrderItemRequest() {
}

	    // getter setter
	}

