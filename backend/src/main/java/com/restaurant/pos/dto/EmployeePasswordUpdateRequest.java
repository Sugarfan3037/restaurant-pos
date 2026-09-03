package com.restaurant.pos.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmployeePasswordUpdateRequest {
@NotBlank(message = "新密碼不可為空")
private String password;

public EmployeePasswordUpdateRequest() {
    }
}
