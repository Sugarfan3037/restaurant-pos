package com.restaurant.pos.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.restaurant.pos.entity.Order;
import com.restaurant.pos.enums.OrderStatus;

public interface OrderRepository extends JpaRepository<Order,Long>{
	List<Order> findByStatus(OrderStatus status);
	Optional<Order> findByRestaurantTableIdAndStatus(
	        Long restaurantTableId,
	        OrderStatus status
	);
	List<Order> findByCreatedAtGreaterThanEqualAndCreatedAtLessThan(LocalDateTime start,LocalDateTime end);
	
	@Query("""
		       SELECT COALESCE(SUM(o.totalAmount), 0)
		       FROM RestaurantOrder o
		       WHERE o.status = :status
		       AND o.paidAt >= :start
		       AND o.paidAt < :end
		       """)
	BigDecimal sumRevenueByPeriod(
			@Param("status") OrderStatus status,
			@Param("start") LocalDateTime start,
			@Param("end") LocalDateTime end
			);
	
	@Query("""
			SELECT COUNT(o)
			FROM RestaurantOrder o
			WHERE o.status=:status
			AND o.paidAt>=:start
			AND o.paidAt<:end
			""")
	Long countOrdersByPeriod(
			@Param("status") OrderStatus status,
			@Param("start") LocalDateTime start,
			@Param("end") LocalDateTime end
			);
}
