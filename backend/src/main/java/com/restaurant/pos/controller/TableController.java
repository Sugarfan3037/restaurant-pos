package com.restaurant.pos.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.pos.dto.OrderDTO;
import com.restaurant.pos.dto.TableDTO;
import com.restaurant.pos.service.CurrentEmployeeService;
import com.restaurant.pos.service.TableService;

@RestController
@RequestMapping("/api/tables")
public class TableController {
private final TableService tableService;
private final CurrentEmployeeService currentEmployeeService;
public TableController(TableService tableService,CurrentEmployeeService currentEmployeeService) {
	this.tableService=tableService;
	this.currentEmployeeService=currentEmployeeService;
}
@GetMapping
public ResponseEntity<List<TableDTO>> findAll(){
	return ResponseEntity.ok(tableService.findAll());
}
@PostMapping("/{tableNumber}/open")
public ResponseEntity<OrderDTO> openTable(@PathVariable Integer tableNumber){
	Long employeeId=currentEmployeeService.getCurrentEmployeeId();
	return ResponseEntity.ok(tableService.openTable(tableNumber, employeeId));
}
@GetMapping("/{tableNumber}/order")
public ResponseEntity<OrderDTO> findCurrentOrder(@PathVariable Integer tableNumber){
	return ResponseEntity.ok(tableService.findCurrentOrder(tableNumber));
}
@PutMapping("/{sourceTableNumber}/change/{targetTableNumber}")
public ResponseEntity<OrderDTO> changeTable(@PathVariable Integer sourceTableNumber,
		                                    @PathVariable Integer targetTableNumber){
	 return ResponseEntity.ok(tableService.changeTable(sourceTableNumber, targetTableNumber));
}
@PutMapping("/{sourceTableNumber}/merge/{targetTableNumber}")
public ResponseEntity<OrderDTO> mergeTable(@PathVariable Integer sourceTableNumber,
		                                   @PathVariable Integer targetTableNumber){
	 return ResponseEntity.ok(tableService.mergeTable(sourceTableNumber,targetTableNumber));
}
}
