package com.restaurant.pos.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import io.jsonwebtoken.JwtException;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
@Value("${jwt.secret}")
private String secret;

@Value("${jwt.expiration}")
private long expiration;

private SecretKey getSigningKey() {
	return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
}
public String generateToken(String username, String role) {
	Date now=new Date();
	Date expiryDate=new Date(now.getTime()+expiration);
	Map<String,Object> claims=new HashMap<>();
	claims.put("role", role);
	return Jwts.builder().claims(claims).subject(username).issuedAt(now).expiration(expiryDate).signWith(getSigningKey()).compact();
}
public String extractUsername(String token) {
    return extractAllClaims(token).getSubject();
}
public String extractRole(String token) {
	return extractAllClaims(token).get("role",String.class);
}
public Date extractExpiration(String token) {
	return extractAllClaims(token).getExpiration();
}
private Claims extractAllClaims(String token) {
	return Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload();
}
public boolean isTokenExpired(String token) {
	Date expirationDate=extractExpiration(token);
	return expirationDate.before(new Date());
}
public boolean isTokenValid(String token,UserDetails userDetails) {
try {
	String username=extractUsername(token);
	return username.equals(userDetails.getUsername()) && !isTokenExpired(token)&&userDetails.isEnabled();
}catch(JwtException|IllegalArgumentException e) {
	return false;
}
}
}
