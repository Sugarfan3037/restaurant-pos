
package com.restaurant.pos.dto;

import java.math.BigDecimal;

import lombok.Data;
@Data
public class OrderItemDTO {
private Long id;
private Long menuItemId;
private String menuItemName;
private Integer quantity;
private BigDecimal unitPrice;
private BigDecimal subtotal;
private String sugarLevel;
private String iceLevel;
private String note;
public OrderItemDTO() {}
public OrderItemDTO(
Long id,
Long menuItemId,
String menuItemName,
Integer quantity,
BigDecimal unitPrice,
BigDecimal subtotal,
String sugarLevel,
String iceLevel,
String note) {

this.id = id;
this.menuItemId = menuItemId;
this.menuItemName = menuItemName;
this.quantity = quantity;
this.unitPrice = unitPrice;
this.subtotal = subtotal;
this.sugarLevel = sugarLevel;
this.iceLevel = iceLevel;
this.note = note;
}
}
