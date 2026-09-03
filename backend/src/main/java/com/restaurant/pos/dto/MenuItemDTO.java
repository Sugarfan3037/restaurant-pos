package com.restaurant.pos.dto;

import java.math.BigDecimal;

import com.restaurant.pos.enums.MenuCategory;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
@Data
public class MenuItemDTO {
	
private Long id;

@NotBlank(message="餐點名稱不可為空")
@Size(max=100,message="餐點名稱不可超過100個字")
private String name;

@NotNull(message="餐點分類不可為空")
private MenuCategory category;

@NotNull(message="價格不可為空")
@DecimalMin(value="0.0",inclusive=false,message="價格必須大於0")
private BigDecimal price;

@NotNull(message = "是否上架不可為空")
private Boolean available=true;

@Size(max=255,message="餐點說明不可超過255個字")
private String description;

public MenuItemDTO() {
}
public MenuItemDTO(
	Long id,
    String name,
    MenuCategory category,
    BigDecimal price,
    Boolean available,
    String description) {
	this.id = id;
    this.name = name;
    this.category = category;
    this.price = price;
    this.available = available;
    this.description = description;
}
//get&set
}
