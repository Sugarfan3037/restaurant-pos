package com.restaurant.pos.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.restaurant.pos.entity.DailyClosing;

public interface DailyClosingRepository extends JpaRepository<DailyClosing,Long>{
Optional<DailyClosing> findByClosingDate(LocalDate closingDate);
Optional<DailyClosing> findTopByOrderByClosedAtDesc();
}
