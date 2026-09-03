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
@Table(name="daily_closing")
public class DailyClosing {
@Id
@GeneratedValue(strategy=GenerationType.IDENTITY)
private Long id;

@Column(name="closing_date",nullable=false,unique=true)
private LocalDate closingDate;

@Column(name="total_orders",nullable=false)
private Integer totalOrders;

@Column(name="total_revenue",nullable=false,precision=12,scale=2)
private BigDecimal totalRevenue;

@Column(name="cash_amount",nullable=false,precision=12,scale=2)
private BigDecimal cashAmount;

@Column(name="card_amount",nullable=false,precision=12,scale=2)
private BigDecimal cardAmount;

@Column(name="other_amount",nullable=false,precision=12,scale=2)
private BigDecimal otherAmount;

@ManyToOne(fetch=FetchType.LAZY)
@JoinColumn(name="employee_id",nullable=false)
private Employee employee;

@Column(name="closed_at",nullable=false)
private LocalDateTime closedAt;

public DailyClosing() {
	
}
//getter&setter
}
