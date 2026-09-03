package com.restaurant.pos.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.pos.dto.CheckoutRequest;
import com.restaurant.pos.dto.PaymentDTO;
import com.restaurant.pos.service.CurrentEmployeeService;
import com.restaurant.pos.service.PaymentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
private final PaymentService paymentService;
private final CurrentEmployeeService currentEmployeeService;
public PaymentController(PaymentService paymentService,CurrentEmployeeService currentEmployeeService) {
	this.paymentService=paymentService;
	this.currentEmployeeService=currentEmployeeService;
}
@PostMapping("/orders/{orderId}/checkout")
public ResponseEntity<PaymentDTO> checkout(@PathVariable Long orderId,
		                                   @Valid@RequestBody CheckoutRequest request){
	Long employeeId=currentEmployeeService.getCurrentEmployeeId();
	return ResponseEntity.ok(paymentService.checkout(orderId, request,employeeId));
}
}
