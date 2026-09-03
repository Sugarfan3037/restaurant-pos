package com.restaurant.pos.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
@Data
public class AddOrderItemRequest {
@NotNull(message="餐點ID不可為空")
private Long menuItemId;

@NotNull(message="數量不可為空")
@Min(value=1,message="數量必須至少為1個")
private Integer quantity;

@Size(max=20,message="糖度不可超過20個字")
private String sugarLevel;

@Size(max=20,message="冰量不可超過20個字")
private String iceLevel;

@Size(max=255,message="備註不可超過255個字")
private String note;
}
