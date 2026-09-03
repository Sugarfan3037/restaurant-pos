	package com.restaurant.pos.service.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.restaurant.pos.dto.LoginRequest;
import com.restaurant.pos.dto.LoginResponse;
import com.restaurant.pos.entity.Employee;
import com.restaurant.pos.exception.BusinessException;
import com.restaurant.pos.repository.EmployeeRepository;
import com.restaurant.pos.security.JwtService;
import com.restaurant.pos.service.AuthService;
@Service
public class AuthServiceImpl implements AuthService{
private final EmployeeRepository employeeRepository;
private final AuthenticationManager authenticationManager;
private final JwtService jwtService;
public AuthServiceImpl(EmployeeRepository employeeRepository,AuthenticationManager authenticationManager
		,JwtService jwtService) {
	this.employeeRepository=employeeRepository;
	this.authenticationManager=authenticationManager;
	 this.jwtService=jwtService;
}
	@Override
	@Transactional(readOnly = true)
	public LoginResponse login(LoginRequest request) {
		Employee employee=employeeRepository.findByUsername(request.getUsername()).orElseThrow(
				                             ()->new BusinessException("帳號或密碼錯誤"));
	try {
             authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
	                            request.getUsername(),
	                            request.getPassword()
	                    ));
              } catch (Exception e) {
                throw new BusinessException("帳號或密碼錯誤");
	        }
		
		String token=jwtService.generateToken(employee.getUsername(),employee.getRole().name());
		return new LoginResponse(
				employee.getId(),
				employee.getUsername(),
				employee.getName(),
				employee.getRole(),
				token
				);
	}   
}
