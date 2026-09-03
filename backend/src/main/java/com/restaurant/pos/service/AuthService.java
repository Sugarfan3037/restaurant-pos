package com.restaurant.pos.service;

import com.restaurant.pos.dto.LoginRequest;
import com.restaurant.pos.dto.LoginResponse;

public interface AuthService {
LoginResponse login(LoginRequest request);
}
