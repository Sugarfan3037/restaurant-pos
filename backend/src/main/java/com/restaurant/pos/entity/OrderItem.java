package com.restaurant.pos.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name="order_item")
public class OrderItem {
@Id
@GeneratedValue(strategy=GenerationType.IDENTITY)
private Long id;

@ManyToOne(fetch=FetchType.LAZY)
@JoinColumn(name="order_id",nullable=false)
private Order order;

@ManyToOne(fetch=FetchType.LAZY)
@JoinColumn(name="menu_item_id",nullable=false)
private MenuItem menuItem;

@Column(nullable=false)
private Integer quantity;

@Column(name="unit_price",nullable=false,precision=10,scale=2)
private BigDecimal unitPrice;

@Column(nullable=false,precision=10,scale=2)
private BigDecimal subtotal;

@Column(name="sugar_level",length=20)
private String sugarLevel;

@Column(name="ice_level",length=20)
private String iceLevel;

@Column(length=255)
private String note;

public OrderItem() {
	
}
//getter&setter
}
