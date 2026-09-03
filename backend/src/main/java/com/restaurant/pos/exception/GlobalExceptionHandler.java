package com.restaurant.pos.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.restaurant.pos.dto.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {
@ExceptionHandler(ResourceNotFoundException.class)
public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex){
	ErrorResponse error=new ErrorResponse(HttpStatus.NOT_FOUND.value()
			                             ,ex.getMessage(),LocalDateTime.now());
	return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
}

@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<Map<String,String>> handleValidation(MethodArgumentNotValidException ex){
	Map<String,String> errors=new HashMap<>();
	ex.getBindingResult().getFieldErrors()
	.forEach(error->{errors.put(error.getField(),error.getDefaultMessage());});
	return ResponseEntity.badRequest().body(errors);
}

@ExceptionHandler(Exception.class)
public ResponseEntity<ErrorResponse> handleException(Exception ex){
	ErrorResponse error=new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value()
			                             ,"系統發生故障",LocalDateTime.now());
	return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
}

@ExceptionHandler(BusinessException.class)
public ResponseEntity<ErrorResponse> handleBusiness(BusinessException ex){
	ErrorResponse error=new ErrorResponse(HttpStatus.BAD_REQUEST.value()
			                             ,ex.getMessage(),LocalDateTime.now());
	return ResponseEntity.badRequest().body(error);
}
}
