package com.webdigital.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.disable()) // Tắt CORS tại Security (vì đã có CorsFilter)
            .csrf(csrf -> csrf.disable()) // Tắt CSRF
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll()); // Cho phép tất cả request

        return http.build();
    }
}
