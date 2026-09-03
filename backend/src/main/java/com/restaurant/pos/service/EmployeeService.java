package com.restaurant.pos.service;

import java.util.List;

import com.restaurant.pos.dto.EmployeeCreateRequest;
import com.restaurant.pos.dto.EmployeeDTO;
import com.restaurant.pos.dto.EmployeeUpdateRequest;


public interface EmployeeService {
List<EmployeeDTO> findAll();
EmployeeDTO findById(Long id);
EmployeeDTO create(EmployeeCreateRequest request);
EmployeeDTO update(Long id,EmployeeUpdateRequest request);
void updatePassword(Long id, String password);
void delete(Long id);
}
