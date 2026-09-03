package com.restaurant.pos.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.restaurant.pos.enums.EmployeeRole;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name="employee")
public class Employee {
@Id
@GeneratedValue(strategy=GenerationType.IDENTITY)
private Long id;

@Column(nullable=false,unique=true,length=50)
private String username;

@Column(nullable=false,length=255)
private String password;

@Column(nullable=false,length=50)
private String name;

@Enumerated(EnumType.STRING)
@Column(nullable=false,length=20)
private EmployeeRole role;

@Column(nullable=false)
private Boolean active=true;

@Column(name="created_at")
private LocalDateTime createdAt;

@Column(name="updated_at")
private LocalDateTime updatedAt;

public Employee() {
	
}
//getter / setter
}
