package com.restaurant.pos.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.restaurant.pos.enums.OrderStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity(name = "RestaurantOrder")
@Table(name="orders")
public class Order {
@Id
@GeneratedValue(strategy=GenerationType.IDENTITY)
private Long id;

@ManyToOne(fetch=FetchType.LAZY)
@JoinColumn(name="table_id",nullable=false)
private RestaurantTable restaurantTable;

@ManyToOne(fetch=FetchType.LAZY)
@JoinColumn(name="employee_id",nullable=false)
private Employee employee;

@Enumerated(EnumType.STRING)
@Column(nullable=false,length=20)
private OrderStatus status=OrderStatus.OPEN;

@Column(name="total_amount",nullable=false,precision=10,scale=2)
private BigDecimal totalAmount=BigDecimal.ZERO;

@Column(name="created_at")
private LocalDateTime createdAt;

@Column(name="updated_at")
private LocalDateTime updatedAt;

@Column(name="paid_at")
private LocalDateTime paidAt;

@OneToMany(mappedBy="order",cascade=CascadeType.ALL,orphanRemoval=true)
private List<OrderItem> items=new ArrayList<>();

public Order() {
	
}
public List<OrderItem> getItems(){
	return items;
}
public void addItem(OrderItem item) {
	items.add(item);
	item.setOrder(this);
}
public void removeItem(OrderItem item) {
	items.remove(item);
	item.setOrder(null);
}
public void moveItemTo(OrderItem item,Order targetOrder) {
	this.items.remove(item);
	targetOrder.getItems().add(item);
	item.setOrder(targetOrder);
}
//getter/setter
}
