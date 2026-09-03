package com.restaurant.pos.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.restaurant.pos.entity.Employee;
import com.restaurant.pos.enums.EmployeeRole;

public interface EmployeeRepository extends JpaRepository<Employee,Long>{
	 Optional<Employee> findByUsername(String username);
	 boolean existsByUsername(String username);
	 Long countByRoleAndActiveTrue(EmployeeRole role);
}
