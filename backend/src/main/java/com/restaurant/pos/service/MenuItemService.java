package com.restaurant.pos.service;

import java.util.List;

import com.restaurant.pos.dto.MenuItemDTO;
import com.restaurant.pos.enums.MenuCategory;

public interface MenuItemService {
List<MenuItemDTO> findAll();
MenuItemDTO findById(Long id);
MenuItemDTO create(MenuItemDTO dto);
MenuItemDTO update(Long id,MenuItemDTO dto);
void delete(Long id);
List<MenuItemDTO> findByCategory(MenuCategory category);
List<MenuItemDTO> findAvailable();
}
