package com.restaurant.pos.service.impl;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.restaurant.pos.dto.CheckoutRequest;
import com.restaurant.pos.dto.PaymentDTO;
import com.restaurant.pos.entity.Employee;
import com.restaurant.pos.entity.Order;
import com.restaurant.pos.entity.Payment;
import com.restaurant.pos.entity.RestaurantTable;
import com.restaurant.pos.enums.OrderStatus;
import com.restaurant.pos.enums.TableStatus;
import com.restaurant.pos.exception.BusinessException;
import com.restaurant.pos.exception.ResourceNotFoundException;
import com.restaurant.pos.repository.EmployeeRepository;
import com.restaurant.pos.repository.OrderRepository;
import com.restaurant.pos.repository.PaymentRepository;
import com.restaurant.pos.service.PaymentService;
@Service
public class PaymentServiceImpl implements PaymentService{
private final PaymentRepository paymentRepository;
private final OrderRepository orderRepository;
private final EmployeeRepository employeeRepository;

public PaymentServiceImpl(PaymentRepository paymentRepository,
	                      OrderRepository orderRepository,
	                      EmployeeRepository employeeRepository) {
	        this.paymentRepository = paymentRepository;
	        this.orderRepository = orderRepository;
	        this.employeeRepository = employeeRepository;
	    }
	@Override
	@Transactional
	public PaymentDTO checkout(Long orderId, CheckoutRequest request,Long employeeId) {
		Order order=orderRepository.findById(orderId).orElseThrow(
				    ()->new ResourceNotFoundException("找不到訂單，id="+orderId));
		if(order.getStatus()!=OrderStatus.OPEN) {
			throw new BusinessException("此訂單不是 OPEN 狀態，無法結帳");
		}
		if(order.getItems().isEmpty()) {
			throw new BusinessException("此訂單沒有任何餐點，無法結帳");
		}
		if(order.getTotalAmount()==null||order.getTotalAmount().signum()<=0) {
			throw new BusinessException("訂單金額必須大於 0");
		}
		if(paymentRepository.findByOrderId(orderId).isPresent()) {
			throw new BusinessException("此訂單已經存在付款紀錄");
		}
		Employee employee=employeeRepository.findById(employeeId)
				          .orElseThrow(()->new ResourceNotFoundException(
				          "找不到員工"));
		if (!Boolean.TRUE.equals(employee.getActive())) {
		    throw new BusinessException("此員工帳號已停用，無法執行結帳");
		}
		
		LocalDateTime now=LocalDateTime.now();
		Payment payment=new Payment();
		payment.setOrder(order);
		payment.setPaymentMethod(request.getPaymentMethod());
		payment.setAmount(order.getTotalAmount());
		payment.setEmployee(employee);
		payment.setPaidAt(now);
		Payment savedPayment=paymentRepository.save(payment);
		
		order.setStatus(OrderStatus.PAID);
		order.setPaidAt(now);
		order.setUpdatedAt(now);
		
		RestaurantTable table=order.getRestaurantTable();
		table.setStatus(TableStatus.AVAILABLE);
		return toDTO(savedPayment);
	}
private PaymentDTO toDTO(Payment payment) {
	return new PaymentDTO(
			payment.getId(),
			payment.getOrder().getId(),
			payment.getPaymentMethod(),
			payment.getAmount(),
			payment.getEmployee().getId(),
			payment.getEmployee().getName(),
			payment.getPaidAt()
			);
}
}
