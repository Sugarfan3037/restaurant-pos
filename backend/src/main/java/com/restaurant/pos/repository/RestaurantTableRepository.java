package com.restaurant.pos.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.restaurant.pos.entity.RestaurantTable;

public interface RestaurantTableRepository extends JpaRepository<RestaurantTable,Long>{
	Optional<RestaurantTable> findByTableNumber(Integer tableNumber);

}
