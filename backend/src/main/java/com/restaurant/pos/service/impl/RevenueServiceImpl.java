package com.restaurant.pos.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.restaurant.pos.dto.RevenueDTO;
import com.restaurant.pos.enums.OrderStatus;
import com.restaurant.pos.enums.PaymentMethod;
import com.restaurant.pos.repository.OrderRepository;
import com.restaurant.pos.repository.PaymentRepository;
import com.restaurant.pos.service.RevenueService;
@Service
public class RevenueServiceImpl implements RevenueService{
private OrderRepository orderRepository;
private final PaymentRepository paymentRepository;
public RevenueServiceImpl(OrderRepository orderRepository,PaymentRepository paymentRepository){
	this.orderRepository=orderRepository;
	this.paymentRepository=paymentRepository;
}
	@Override
	@Transactional(readOnly = true)
	public RevenueDTO getTodayRevenue() {
		LocalDate today=LocalDate.now();
		return getDailyRevenue(today);
	}

	@Override
	@Transactional(readOnly = true)
	public RevenueDTO getDailyRevenue(LocalDate date) {
		LocalDateTime start=date.atStartOfDay();
		LocalDateTime end=date.plusDays(1).atStartOfDay();
		return buildRevenueDTO(date.toString(),start,end);
	}

	@Override
	@Transactional(readOnly = true)
	public RevenueDTO getMonthlyRevenue(YearMonth yearMonth) {
		LocalDateTime start=yearMonth.atDay(1).atStartOfDay();
		LocalDateTime end=yearMonth.plusMonths(1).atDay(1).atStartOfDay();
		return buildRevenueDTO(yearMonth.toString(),start,end);
	}
	private RevenueDTO buildRevenueDTO(String period,LocalDateTime start,LocalDateTime end) {
		Long totalOrders=orderRepository.countOrdersByPeriod(OrderStatus.PAID, start, end);
		BigDecimal totalRevenue=orderRepository.sumRevenueByPeriod(OrderStatus.PAID, start, end);
		BigDecimal cashAmount=paymentRepository.sumAmountByPaymentMethodAndPeriod(PaymentMethod.CASH, start, end);
		BigDecimal cardAmount=paymentRepository.sumAmountByPaymentMethodAndPeriod(PaymentMethod.CREDIT_CARD, start, end);
		BigDecimal linePayAmount=paymentRepository.sumAmountByPaymentMethodAndPeriod(PaymentMethod.LINE_PAY, start, end);
		
		return new RevenueDTO(period,totalOrders,totalRevenue,cashAmount,cardAmount,linePayAmount);
	}

}
