package com.restaurant.pos.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.pos.dto.LoginRequest;
import com.restaurant.pos.dto.LoginResponse;
import com.restaurant.pos.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
private final AuthService authService;
public AuthController(AuthService authService) {
	this.authService=authService;
}@PostMapping("/login")
public ResponseEntity<LoginResponse> login(@Valid@RequestBody LoginRequest request){
	return ResponseEntity.ok(authService.login(request));
}
}
