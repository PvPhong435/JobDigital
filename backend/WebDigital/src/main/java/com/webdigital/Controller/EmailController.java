package com.webdigital.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.webdigital.DTO.EmailOrder;
import com.webdigital.DTO.OrderDTO;
import com.webdigital.Model.Product;
import com.webdigital.Service.EmailService;
import com.webdigital.Service.MailAuthService;

import jakarta.mail.MessagingException;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private MailAuthService emailService;

    @PostMapping("/sendOrderMail")
    public ResponseEntity<String> createOrder(@RequestBody EmailOrder emailOrder) {
        try {
            emailService.sendOrderEmail(emailOrder);
            return ResponseEntity.ok("Email xác nhận đơn hàng đã được gửi thành công.");
        } catch (MessagingException e) {
            return ResponseEntity.status(500).body("Lỗi khi gửi email: " + e.getMessage());
        }
    }
}
