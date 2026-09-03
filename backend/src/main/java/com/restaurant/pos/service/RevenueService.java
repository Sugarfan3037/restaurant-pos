package com.restaurant.pos.service;

import java.time.LocalDate;
import java.time.YearMonth;

import com.restaurant.pos.dto.RevenueDTO;

public interface RevenueService {
RevenueDTO getTodayRevenue();
RevenueDTO getDailyRevenue(LocalDate date);
RevenueDTO getMonthlyRevenue(YearMonth yearMonth);
}
