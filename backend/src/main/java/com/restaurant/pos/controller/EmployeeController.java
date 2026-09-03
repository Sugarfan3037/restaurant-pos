package com.restaurant.pos.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.restaurant.pos.dto.EmployeePasswordUpdateRequest;
import com.restaurant.pos.dto.EmployeeCreateRequest;
import com.restaurant.pos.dto.EmployeeDTO;
import com.restaurant.pos.dto.EmployeeUpdateRequest;
import com.restaurant.pos.service.EmployeeService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
private final EmployeeService employeeService;
public EmployeeController(EmployeeService employeeService) {
	this.employeeService=employeeService;
}
@GetMapping
public ResponseEntity<List<EmployeeDTO>> findAll(){
	return ResponseEntity.ok(employeeService.findAll()); 
}
@GetMapping("/{id}")
public ResponseEntity<EmployeeDTO> findById(@PathVariable Long id){
	return ResponseEntity.ok(employeeService.findById(id));
}
@PostMapping
public ResponseEntity<EmployeeDTO> create(@Valid@RequestBody EmployeeCreateRequest request){
	return ResponseEntity.ok(employeeService.create(request));
}
@PutMapping("/{id}")
public ResponseEntity<EmployeeDTO> update(@PathVariable Long id,@Valid
		                                                                         @RequestBody EmployeeUpdateRequest request){
	 return ResponseEntity.ok(employeeService.update(id,request));
}
@PutMapping("/{id}/password")
public ResponseEntity<Void> updatePassword(
        @PathVariable Long id,
        @Valid @RequestBody EmployeePasswordUpdateRequest request) {

    employeeService.updatePassword(id, request.getPassword());

    return ResponseEntity.noContent().build();
}
@DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable Long id){
	employeeService.delete(id);
	return ResponseEntity.noContent().build();
}
}

