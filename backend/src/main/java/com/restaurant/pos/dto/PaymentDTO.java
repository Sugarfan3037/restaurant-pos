package com.restaurant.pos.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.restaurant.pos.enums.PaymentMethod;

import lombok.Data;
@Data
public class PaymentDTO {
private Long id;
private Long orderId;
private PaymentMethod paymentMethod;
private BigDecimal amount;
private Long employeeId;
private String employeeName;
private LocalDateTime paidAt;

public PaymentDTO(){}

public PaymentDTO(Long id,Long orderId,PaymentMethod paymentMethod,
                  BigDecimal amount,Long employeeId,String employeeName,
                  LocalDateTime paidAt) {
this.id=id;
this.orderId=orderId;
this.paymentMethod=paymentMethod;
this.amount=amount;
this.employeeId=employeeId;
this.employeeName=employeeName;
this.paidAt=paidAt;
}
}
