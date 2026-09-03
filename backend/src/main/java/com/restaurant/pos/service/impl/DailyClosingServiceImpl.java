package com.restaurant.pos.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.restaurant.pos.dto.DailyClosingDTO;
import com.restaurant.pos.entity.DailyClosing;
import com.restaurant.pos.entity.Employee;
import com.restaurant.pos.enums.OrderStatus;
import com.restaurant.pos.enums.PaymentMethod;
import com.restaurant.pos.exception.BusinessException;
import com.restaurant.pos.exception.ResourceNotFoundException;
import com.restaurant.pos.repository.DailyClosingRepository;
import com.restaurant.pos.repository.EmployeeRepository;
import com.restaurant.pos.repository.OrderRepository;
import com.restaurant.pos.repository.PaymentRepository;
import com.restaurant.pos.service.DailyClosingService;
@Service
public class DailyClosingServiceImpl implements DailyClosingService{
private final DailyClosingRepository dailyClosingRepository;
private final OrderRepository orderRepository;
private final PaymentRepository paymentRepository;
private final EmployeeRepository employeeRepository;
public DailyClosingServiceImpl(DailyClosingRepository dailyClosingRepository,
		                                                OrderRepository orderRepository,
		                                                PaymentRepository paymentRepository,
		                                                EmployeeRepository employeeRepository) {
	this.dailyClosingRepository=dailyClosingRepository;
	this.employeeRepository=employeeRepository;
	this.orderRepository=orderRepository;
	this.paymentRepository=paymentRepository;
}
	@Override
	 @Transactional
	public DailyClosingDTO closeDay(LocalDate date, Long employeeId) {
		if(date.isAfter(LocalDate.now())) {
		    throw new BusinessException("不可對未來日期執行日結");
		}
		if(dailyClosingRepository.findByClosingDate(date).isPresent()) {
			throw new BusinessException(date+"已經完成日結");
		}
		Employee employee=employeeRepository.findById(employeeId).orElseThrow(
				                            ()->new ResourceNotFoundException("找不到員工，id="+ employeeId));
		
		LocalDateTime currentClosingTime=LocalDateTime.now();
		
		Optional<DailyClosing> lastClosingOptional=dailyClosingRepository.findTopByOrderByClosedAtDesc();
		LocalDateTime start;
		if(lastClosingOptional.isPresent()) {
			DailyClosing lastClosing=lastClosingOptional.get();
			if(!date.isAfter(lastClosing.getClosingDate())) {
				throw new BusinessException( "日結日期必須晚於上一次日結日期："
                                                                       + lastClosing.getClosingDate());
			}
			start=lastClosing.getClosedAt();
		}else {
			start=date.atStartOfDay();
		}
		LocalDateTime end=currentClosingTime;
		
		Long orderCount=orderRepository.countOrdersByPeriod(OrderStatus.PAID, start, end);
		BigDecimal totalRevenue=orderRepository.sumRevenueByPeriod(OrderStatus.PAID, start, end);
		BigDecimal cashAmount=paymentRepository.sumAmountByPaymentMethodAndPeriod(PaymentMethod.CASH, start, end);
		BigDecimal cardAmount=paymentRepository.sumAmountByPaymentMethodAndPeriod(PaymentMethod.CREDIT_CARD, start, end);
		BigDecimal linePayAmount=paymentRepository.sumAmountByPaymentMethodAndPeriod(PaymentMethod.LINE_PAY, start, end);
		
		DailyClosing closing=new DailyClosing();
		closing.setClosingDate(date);
		closing.setTotalOrders(orderCount.intValue());
		closing.setTotalRevenue(totalRevenue);
		closing.setCashAmount(cashAmount);
		closing.setCardAmount(cardAmount);
		closing.setOtherAmount(linePayAmount);
		closing.setEmployee(employee);
		closing.setClosedAt(currentClosingTime);
		DailyClosing saved=dailyClosingRepository.save(closing);
		return toDTO(saved);
	}

	@Override
	@Transactional(readOnly = true)
	public DailyClosingDTO findByDate(LocalDate date) {
		DailyClosing closing=dailyClosingRepository.findByClosingDate(date).orElseThrow(
				                             ()->new ResourceNotFoundException("找不到"+date+"的日結紀錄"));
		return toDTO(closing);
	}
	private DailyClosingDTO toDTO(DailyClosing closing) {
		return new DailyClosingDTO(closing.getId(),closing.getClosingDate(),Integer.valueOf(closing.getTotalOrders()),
				                                            closing.getTotalRevenue(),closing.getCashAmount(),closing.getCardAmount()
				                                            ,closing.getOtherAmount(),closing.getEmployee().getId(),closing.getEmployee().getName()
				                                            ,closing.getClosedAt());
	}

}
