//package com.webdigital.Config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//
//@Configuration
//public class SecurityConfig {
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll()) // Cho phép tất cả request
//            .csrf(csrf -> csrf.disable()); // Tắt CSRF nếu cần test API
//
//        return http.build();
//    }
//}
