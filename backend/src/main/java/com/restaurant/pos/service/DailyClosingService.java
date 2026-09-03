package com.restaurant.pos.service;

import java.time.LocalDate;

import com.restaurant.pos.dto.DailyClosingDTO;

public interface DailyClosingService {
DailyClosingDTO closeDay(LocalDate date, Long emloyeeId);
DailyClosingDTO findByDate(LocalDate date);
}
