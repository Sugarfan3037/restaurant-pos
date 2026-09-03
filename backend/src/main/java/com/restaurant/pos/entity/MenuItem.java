package com.restaurant.pos.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.restaurant.pos.enums.MenuCategory;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="menu_item")
public class MenuItem {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable=false,length=100)
	private String name;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable=false,length=30)
	private MenuCategory category;
	
	@Column(nullable=false,precision=10,scale=2)
	private BigDecimal price;
	
	@Column(nullable=false)
	private Boolean available=true;
	
	@Column(length=255)
	private String description;
	
	@Column(name="created_at")
	private LocalDateTime createdAt;

	@Column(name="updated_at")
	private LocalDateTime updatedAt;

	public MenuItem() {
	}
	@PrePersist
	public void prePersist() {
		LocalDateTime now=LocalDateTime.now();
		createdAt=now;
		updatedAt=now;
		if(available==null) {
			available=true;
		}	
	}
	@PreUpdate
	public void preUpdate() {
		updatedAt=LocalDateTime.now();
	}
	//getter / setter
	}
