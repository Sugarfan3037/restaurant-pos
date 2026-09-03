package com.restaurant.pos.dto;

import com.restaurant.pos.enums.PaymentMethod;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CheckoutRequest {
@NotNull(message="付款方式不可為空")
private PaymentMethod paymentMethod;

public CheckoutRequest() {	
}

//get&set
}
