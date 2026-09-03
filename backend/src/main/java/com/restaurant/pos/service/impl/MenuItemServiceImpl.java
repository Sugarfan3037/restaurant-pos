package com.restaurant.pos.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.restaurant.pos.dto.MenuItemDTO;
import com.restaurant.pos.entity.MenuItem;
import com.restaurant.pos.enums.MenuCategory;
import com.restaurant.pos.exception.ResourceNotFoundException;
import com.restaurant.pos.repository.MenuItemRepository;
import com.restaurant.pos.service.MenuItemService;

@Service
public class MenuItemServiceImpl implements MenuItemService{
private final MenuItemRepository menuItemRepository;

public MenuItemServiceImpl(MenuItemRepository menuItemRepository) {
	this.menuItemRepository=menuItemRepository;
}

@Override
public List<MenuItemDTO> findAll() {

        return menuItemRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }


@Override
public MenuItemDTO findById(Long id) {
	MenuItem menuItem=menuItemRepository.findById(id)
			.orElseThrow(()->new ResourceNotFoundException("找不到餐點,id="+id));
	return toDTO(menuItem);
}

@Override
public MenuItemDTO create(MenuItemDTO dto) {
	MenuItem menuItem=new MenuItem();
	menuItem.setName(dto.getName());
	menuItem.setCategory(dto.getCategory());
	menuItem.setPrice(dto.getPrice());
	menuItem.setAvailable(dto.getAvailable());
	menuItem.setDescription(dto.getDescription());
	MenuItem saved=menuItemRepository.save(menuItem);
	return toDTO(saved);
}

@Override
public MenuItemDTO update(Long id, MenuItemDTO dto) {
		MenuItem menuItem=menuItemRepository.findById(id)
				                             .orElseThrow(()->new ResourceNotFoundException("找不到餐點,id="+id));
		menuItem.setName(dto.getName());
		menuItem.setCategory(dto.getCategory());
		menuItem.setPrice(dto.getPrice());
		menuItem.setAvailable(dto.getAvailable());
		menuItem.setDescription(dto.getDescription());
		MenuItem updated=menuItemRepository.save(menuItem);
		return toDTO(updated);
}

@Override
public void delete(Long id) {
	if(!menuItemRepository.existsById(id)) {
		throw new ResourceNotFoundException("找不到餐點，id="+id);
	}
	menuItemRepository.deleteById(id);
}

@Override
public List<MenuItemDTO> findByCategory(MenuCategory category) {
	return menuItemRepository.findByCategory(category).stream().map(this::toDTO).toList();
}

@Override
public List<MenuItemDTO> findAvailable() {
	return menuItemRepository.findByAvailableTrue().stream().map(this::toDTO).toList();
}
private MenuItemDTO toDTO(MenuItem menuItem) {
	return new MenuItemDTO(
			menuItem.getId(),
			menuItem.getName(),
			menuItem.getCategory(),
			menuItem.getPrice(),
			menuItem.getAvailable(),
			menuItem.getDescription()
			);
}
}
