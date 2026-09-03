package com.restaurant.pos.service;

import com.restaurant.pos.dto.CheckoutRequest;
import com.restaurant.pos.dto.PaymentDTO;

public interface PaymentService {
PaymentDTO checkout(Long orderId,CheckoutRequest request,Long employeeId);
}
