package com.restaurant.pos.dto;

import com.restaurant.pos.enums.EmployeeRole;

import lombok.Data;
@Data
public class LoginResponse {
private Long employeeId;
private String username;
private String name;
private EmployeeRole role;
private String token;

public LoginResponse() {}

public LoginResponse(Long employeeId,String username,String name,EmployeeRole role,String token) {
	this.employeeId=employeeId;
	this.username=username;
	this.name=name;
	this.role=role;
	this.token=token;
}
}
