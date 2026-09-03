package com.restaurant.pos.dto;

import com.restaurant.pos.enums.EmployeeRole;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
@Data
public class EmployeeCreateRequest {
@NotBlank(message="帳號不可為空")
@Size(max=50)
private String username;

@NotBlank(message="密碼不可為空")
private String password;

@NotBlank(message="名字不可為空")
@Size(max=50)
private String name;

@NotNull(message="角色不可為空")
private EmployeeRole role;
public EmployeeCreateRequest() {}
}
