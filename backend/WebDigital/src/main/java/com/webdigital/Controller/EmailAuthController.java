package com.webdigital.Controller;

import org.springframework.web.bind.annotation.*;

import com.webdigital.DTO.EmailOTP;
import com.webdigital.Service.MailAuthService;

import org.springframework.http.ResponseEntity;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/password-reset")
public class EmailAuthController {

	@Autowired
    private MailAuthService mailService;

	@PostMapping("/sendVerificationCode")
    public ResponseEntity<String> sendVerificationCode(@RequestBody EmailOTP request) {
		System.out.println("Received email: " + request.getEmail());
	    System.out.println("Received OTP: " + request.getOtp());
		try {
            mailService.sendVerificationEmail(request);
            return ResponseEntity.ok("Mã xác thực đã được gửi đến email của bạn.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            
            System.out.println(e.toString());
        	return ResponseEntity.status(500).body(e.toString());
            
        } 
    }
	
	
}
