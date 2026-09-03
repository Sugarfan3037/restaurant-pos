package com.restaurant.pos.security;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.restaurant.pos.entity.Employee;
import com.restaurant.pos.repository.EmployeeRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService{
private final EmployeeRepository employeeRepository;
public CustomUserDetailsService(EmployeeRepository employeeRepository) {
	this.employeeRepository=employeeRepository;
}
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Employee employee=employeeRepository.findByUsername(username).orElseThrow(
				                            ()->new UsernameNotFoundException("找不到帳號:"+username));
		return User.builder().username(employee.getUsername())
				                             .password(employee.getPassword())
				                             .roles(employee.getRole().name())
				                             .disabled(!Boolean.TRUE.equals(employee.getActive())).build();
				                            
	}

}
