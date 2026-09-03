package com.restaurant.pos.dto;

import com.restaurant.pos.enums.EmployeeRole;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class EmployeeUpdateRequest {
@NotBlank(message = "姓名不可為空")
private String name;

@NotNull(message = "角色不可為空")
private EmployeeRole role;

@NotNull(message = "active不可為空")
private Boolean active;

public EmployeeUpdateRequest() {}
}
