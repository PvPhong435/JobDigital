package com.webdigital.Controller;

import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<String> sendVerificationCode(@RequestBody Map<String, String> request) {
        try {
            mailService.sendVerificationEmail(request);
            return ResponseEntity.ok("Mã xác thực đã được gửi đến email của bạn.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi khi gửi email! Vui lòng thử lại."+e.toString());
        } 
    }
}
