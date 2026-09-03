package com.restaurant.pos.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.restaurant.pos.enums.PaymentMethod;

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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="payment")
public class Payment {
@Id
@GeneratedValue(strategy=GenerationType.IDENTITY)
private Long id;

@OneToOne(fetch=FetchType.LAZY)
@JoinColumn(name="order_id",nullable=false,unique=true)
private Order order;

@Enumerated(EnumType.STRING)
@Column(name="payment_method",nullable=false,length=30)
private PaymentMethod paymentMethod;

@Column(nullable=false,precision=10,scale=2)
private BigDecimal amount; 

@Column(name="paid_at",nullable=false)
private LocalDateTime paidAt;

@ManyToOne(fetch=FetchType.LAZY)
@JoinColumn(name="employee_id",nullable=false)
private Employee employee;

public Payment() {
	
}
//getter&setter
}
