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

import com.restaurant.pos.dto.MenuItemDTO;
import com.restaurant.pos.enums.MenuCategory;
import com.restaurant.pos.service.MenuItemService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/menu-items")
public class MenuItemController {
private final MenuItemService menuItemService;
public MenuItemController(MenuItemService menuItemService) {
	this.menuItemService=menuItemService;
}
@GetMapping
public ResponseEntity<List<MenuItemDTO>> findAll(){
	return ResponseEntity.ok(menuItemService.findAll());
}
@GetMapping("/{id}")
public ResponseEntity<MenuItemDTO> findById(@PathVariable Long id){
	return ResponseEntity.ok(menuItemService.findById(id));
}
@PostMapping
public ResponseEntity<MenuItemDTO>create(@Valid@RequestBody MenuItemDTO dto){
	return ResponseEntity.ok(menuItemService.create(dto));
}
@PutMapping("/{id}")
public ResponseEntity<MenuItemDTO> update(@PathVariable Long id,@Valid@RequestBody MenuItemDTO dto){
	return ResponseEntity.ok(menuItemService.update(id,dto));
}
@DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable Long id){
	menuItemService.delete(id);
	return ResponseEntity.noContent().build();
}
@GetMapping("/category/{category}")
public ResponseEntity<List<MenuItemDTO>>findByCategory(@PathVariable MenuCategory category){
	return ResponseEntity.ok(menuItemService.findByCategory(category));
}
@GetMapping("/available")
public ResponseEntity<List<MenuItemDTO>>findAvailable(){
	return ResponseEntity.ok(menuItemService.findAvailable());
}
}
