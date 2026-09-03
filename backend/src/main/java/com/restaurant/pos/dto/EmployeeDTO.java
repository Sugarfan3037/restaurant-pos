package com.restaurant.pos.dto;

import com.restaurant.pos.enums.EmployeeRole;

import lombok.Data;
@Data
public class EmployeeDTO {
private Long id;
private String username;
private String name;
private EmployeeRole role;
private Boolean active;

public EmployeeDTO() {}
public EmployeeDTO(Long id,String username,String name,EmployeeRole role,Boolean active) {
	this.id=id;
	this.username=username;
	this.name=name;
	this.role=role;
	this.active=active;
}
}
