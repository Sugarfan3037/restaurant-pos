package com.restaurant.pos.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import lombok.Data;

@Data
public class CreateOrderRequest {

    @NotNull(
        message = "桌號不可為空"
    )
    @Min(
        value = 1,
        message = "桌號最小為1"
    )
    @Max(
        value = 20,
        message = "桌號最大為20"
    )
    private Integer tableNo;
}