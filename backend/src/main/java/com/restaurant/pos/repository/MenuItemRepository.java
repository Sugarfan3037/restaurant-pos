package com.restaurant.pos.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.restaurant.pos.entity.MenuItem;
import com.restaurant.pos.enums.MenuCategory;

public interface MenuItemRepository extends JpaRepository<MenuItem,Long>{
List<MenuItem> findByCategory(MenuCategory category);
List<MenuItem> findByAvailableTrue();
}
