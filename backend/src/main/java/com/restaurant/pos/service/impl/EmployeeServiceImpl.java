package com.restaurant.pos.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.restaurant.pos.dto.EmployeeCreateRequest;
import com.restaurant.pos.dto.EmployeeDTO;
import com.restaurant.pos.dto.EmployeeUpdateRequest;
import com.restaurant.pos.entity.Employee;
import com.restaurant.pos.enums.EmployeeRole;
import com.restaurant.pos.exception.BusinessException;
import com.restaurant.pos.exception.ResourceNotFoundException;
import com.restaurant.pos.repository.EmployeeRepository;
import com.restaurant.pos.service.EmployeeService;



@Service
public class EmployeeServiceImpl implements EmployeeService{
	private final EmployeeRepository employeeRepository;
	private final PasswordEncoder passwordEncoder;
	public EmployeeServiceImpl(EmployeeRepository employeeRepository,PasswordEncoder passwordEncoder) {
		this.employeeRepository=employeeRepository;
		this.passwordEncoder=passwordEncoder;
	}
	@Override
	@Transactional(readOnly = true)
	public List<EmployeeDTO> findAll() {
     return employeeRepository.findAll().stream().map(this::toDTO).toList();
	}

	@Override
	 @Transactional(readOnly = true)
	public EmployeeDTO findById(Long id) {
		Employee employee=employeeRepository.findById(id).orElseThrow(
				                            ()->new ResourceNotFoundException("找不到員工，id="+id));
		return toDTO(employee);
	}

	@Override
	@Transactional
	public EmployeeDTO create(EmployeeCreateRequest request) {
		if(employeeRepository.existsByUsername(request.getUsername())) {
			throw new BusinessException("帳號已存在:"+request.getUsername());
		}
		Employee employee=new Employee();
		employee.setUsername(request.getUsername());
		employee.setPassword(passwordEncoder.encode(request.getPassword()));
		employee.setName(request.getName());
		employee.setRole(request.getRole());
		employee.setActive(true);
		employee.setCreatedAt(LocalDateTime.now());
		employee.setUpdatedAt(LocalDateTime.now());
		Employee saved=employeeRepository.save(employee);
		return toDTO(saved);
	}

	@Override
	@Transactional
	public EmployeeDTO update(Long id, EmployeeUpdateRequest request) {
		Employee employee=employeeRepository.findById(id).orElseThrow(
				                             ()->new ResourceNotFoundException("找不到員工，id="+id));
		
		boolean wasActiveAdmin=employee.getRole()==EmployeeRole.ADMIN&&Boolean.TRUE.equals(employee.getActive());
		boolean willBeActiveAdmin=request.getRole()==EmployeeRole.ADMIN&&Boolean.TRUE.equals(request.getActive());
		if(wasActiveAdmin&&!willBeActiveAdmin) {
			 validateNotLastActiveAdmin();
		}
		employee.setName(request.getName());
		employee.setRole(request.getRole());
		employee.setActive(request.getActive());
		employee.setUpdatedAt(LocalDateTime.now());
		Employee saved=employeeRepository.save(employee);
		return toDTO(saved);
	}

	@Override
	@Transactional
	public void delete(Long id) {
		Employee employee=employeeRepository.findById(id).orElseThrow(
                ()->new ResourceNotFoundException("找不到員工，id="+id));
		if (!Boolean.TRUE.equals(employee.getActive())){
            return;
        }
		if (employee.getRole()==EmployeeRole.ADMIN){
			validateNotLastActiveAdmin();
        }
		employee.setActive(false);
		employee.setUpdatedAt(LocalDateTime.now());
		employeeRepository.save(employee);
	}
	private void validateNotLastActiveAdmin() {
		long activeAdminCount=employeeRepository.countByRoleAndActiveTrue(EmployeeRole.ADMIN);
		if(activeAdminCount <= 1) {
			throw new BusinessException("系統至少必須保留一位啟用中的管理員");
		}
	}
	private EmployeeDTO toDTO(Employee employee) {
		return new EmployeeDTO(employee.getId(),employee.getUsername(),employee.getName(),
				                                       employee.getRole(),employee.getActive());
	}
	@Override
	@Transactional
	public void updatePassword(Long id, String password){
		Employee employee=employeeRepository.findById(id).orElseThrow(
				          () ->new ResourceNotFoundException(
	                            "找不到員工，id=" + id
	                    )
	            );

	    employee.setPassword(
	            passwordEncoder.encode(password)
	    );

	    employee.setUpdatedAt(LocalDateTime.now());
	}

}
