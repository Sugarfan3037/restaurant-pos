package com.restaurant.pos.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.restaurant.pos.entity.Payment;
import com.restaurant.pos.enums.PaymentMethod;

public interface PaymentRepository extends JpaRepository<Payment,Long>{
Optional<Payment> findByOrderId(Long orderId);
@Query("""
        SELECT COALESCE(SUM(p.amount), 0)
        FROM Payment p
        WHERE p.paymentMethod = :paymentMethod
        AND p.paidAt >= :start
        AND p.paidAt < :end
        """)
BigDecimal sumAmountByPaymentMethodAndPeriod(@Param("paymentMethod")PaymentMethod paymentMethod
		                                                                                   ,@Param("start")LocalDateTime start
		                                                                                   ,@Param("end")LocalDateTime end);
}
