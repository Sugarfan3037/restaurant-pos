package com.restaurant.pos.service.impl;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.restaurant.pos.entity.Employee;
import com.restaurant.pos.exception.BusinessException;
import com.restaurant.pos.exception.ResourceNotFoundException;
import com.restaurant.pos.repository.EmployeeRepository;
import com.restaurant.pos.service.CurrentEmployeeService;
@Service
public class CurrentEmployeeServiceImpl implements CurrentEmployeeService{
private final EmployeeRepository employeeRepository;
public CurrentEmployeeServiceImpl(EmployeeRepository employeeRepository) {
	this.employeeRepository=employeeRepository;
}
	@Override
	@Transactional(readOnly = true)
	public Employee getCurrentEmployee() {
		Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
		if(authentication==null||!authentication.isAuthenticated()) {
			throw new BusinessException("目前沒有登入員工");
		}
		String username=authentication.getName();
		return employeeRepository.findByUsername(username).orElseThrow(
				()->new ResourceNotFoundException( "找不到目前登入的員工"));
	}

	@Override
	@Transactional(readOnly = true)
	public Long getCurrentEmployeeId() {
		return getCurrentEmployee().getId();
	}

}
