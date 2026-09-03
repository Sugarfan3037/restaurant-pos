package com.restaurant.pos.exception;

public class ResourceNotFoundException extends RuntimeException{
public ResourceNotFoundException(String message) {
	super(message);
}
}
