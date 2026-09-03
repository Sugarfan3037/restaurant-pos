package com.restaurant.pos.controller;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.pos.dto.DailyClosingDTO;
import com.restaurant.pos.service.CurrentEmployeeService;
import com.restaurant.pos.service.DailyClosingService;
@RestController
@RequestMapping("/api/daily-closing")
public class DailyClosingController {
private final DailyClosingService dailyClosingService;
private final CurrentEmployeeService currentEmployeeService;
public DailyClosingController(DailyClosingService dailyClosingService,CurrentEmployeeService currentEmployeeService) {
	this.dailyClosingService=dailyClosingService;
	this.currentEmployeeService=currentEmployeeService;
}
@PostMapping("/{date}")
public ResponseEntity<DailyClosingDTO> closeDay(@PathVariable@DateTimeFormat(iso=DateTimeFormat.ISO.DATE)
                                                                                           LocalDate date){
	Long employeeId=currentEmployeeService.getCurrentEmployeeId();
	return ResponseEntity.ok(dailyClosingService.closeDay(date, employeeId));
}
@GetMapping("/{date}")
public ResponseEntity<DailyClosingDTO> findByDate(@PathVariable@DateTimeFormat(iso=DateTimeFormat.ISO.DATE)
                                                                                              LocalDate date){
	return ResponseEntity.ok( dailyClosingService.findByDate(date));
}                                 
}
