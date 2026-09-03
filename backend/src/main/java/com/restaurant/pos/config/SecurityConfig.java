package com.restaurant.pos.config;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.http.SessionCreationPolicy;
import com.restaurant.pos.security.CustomUserDetailsService;
import com.restaurant.pos.security.JwtAuthenticationFilter;
import org.springframework.http.HttpMethod;
@Configuration
public class SecurityConfig{
private final CustomUserDetailsService userDetailsService;
private final JwtAuthenticationFilter jwtAuthenticationFilter;
public SecurityConfig(CustomUserDetailsService userDetailsService,JwtAuthenticationFilter jwtAuthenticationFilter) {
	this.userDetailsService=userDetailsService;
	this.jwtAuthenticationFilter=jwtAuthenticationFilter;
}
@Bean
public PasswordEncoder passwordEncoder() {
        return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
    }
@Bean
public AuthenticationProvider authenticationProvider(PasswordEncoder passwordEncoder) {
	DaoAuthenticationProvider provider=new DaoAuthenticationProvider(userDetailsService);
	provider.setPasswordEncoder(passwordEncoder);
	return provider;
}
@Bean
public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration)
        throws Exception {
    return configuration.getAuthenticationManager();
}
@Bean
public SecurityFilterChain securityFilterChain( HttpSecurity http,AuthenticationProvider authenticationProvider) 
		    throws Exception{
	http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
	        .csrf(csrf->csrf.disable()).sessionManagement
	        (session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	        .authenticationProvider(authenticationProvider).authorizeHttpRequests(
			auth->auth.requestMatchers("/api/auth/**").permitAll().requestMatchers("/api/employees/**").hasRole("ADMIN")
			.requestMatchers("/api/daily-closing/**").hasRole("ADMIN").requestMatchers("/api/revenue/**").hasRole("ADMIN")
			.requestMatchers(HttpMethod.POST,"/api/menu-items/**").hasRole("ADMIN").requestMatchers(HttpMethod.PUT,"/api/menu-items/**")
			.hasRole("ADMIN").requestMatchers(HttpMethod.DELETE,"/api/menu-items/**").hasRole("ADMIN")
			.anyRequest().authenticated()).addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
	
	return http.build();
}
@Bean
public CorsConfigurationSource corsConfigurationSource() {
	CorsConfiguration configuration=new CorsConfiguration();
	configuration.setAllowedOrigins(List.of("http://localhost:5173"));
	configuration.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
	configuration.setAllowedHeaders(List.of("*"));
	configuration.setAllowCredentials(true);
	UrlBasedCorsConfigurationSource source=new UrlBasedCorsConfigurationSource();
	source.registerCorsConfiguration("/**", configuration);
	return source;
}
}
