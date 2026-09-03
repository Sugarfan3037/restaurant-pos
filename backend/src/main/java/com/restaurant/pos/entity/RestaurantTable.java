package com.restaurant.pos.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.restaurant.pos.enums.TableStatus;

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
@Table(name="restaurant_table")
public class RestaurantTable {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	
   @Column(name="table_number",nullable=false,unique=true)
   private Integer tableNumber;
   
   @Column(nullable=false)
   private Integer capacity;
   
   @Enumerated(EnumType.STRING)
   @Column(nullable = false, length = 20)
   private TableStatus status;
   
   @Column(name="created_at")
	private LocalDateTime createdAt;

	@Column(name="updated_at")
	private LocalDateTime updatedAt;
	public RestaurantTable() {
    }

    // getter / setter
}
