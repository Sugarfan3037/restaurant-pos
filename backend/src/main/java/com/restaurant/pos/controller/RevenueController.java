package com.restaurant.pos.controller;

import java.time.LocalDate;
import java.time.YearMonth;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.pos.dto.RevenueDTO;
import com.restaurant.pos.service.RevenueService;

@RestController
@RequestMapping("/api/revenue")
public class RevenueController {
private final RevenueService revenueService;
public RevenueController(RevenueService revenueService) {
	this.revenueService=revenueService;
}
@GetMapping("today")
public ResponseEntity<RevenueDTO> getTodayRevenue(){
	return ResponseEntity.ok(revenueService.getTodayRevenue());
}
@GetMapping("/date/{date}")
public ResponseEntity<RevenueDTO> getDailyRevenue(@PathVariable
		                                          @DateTimeFormat(iso=DateTimeFormat.ISO.DATE)
                                                 LocalDate date){
	return ResponseEntity.ok(revenueService.getDailyRevenue(date));
}
@GetMapping("/month/{yearMonth}")
public ResponseEntity<RevenueDTO> getmonthRevenue(@PathVariable
		                                          @DateTimeFormat(pattern="yyyy-MM")
                                                  YearMonth yearMonth){
	return ResponseEntity.ok(revenueService.getMonthlyRevenue(yearMonth));
}
}
