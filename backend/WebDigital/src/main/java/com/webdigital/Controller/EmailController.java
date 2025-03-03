package com.webdigital.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.webdigital.Service.EmailService;

import jakarta.mail.MessagingException;

@Controller
@RequestMapping("/api/email")
public class EmailController {
	@Autowired
    private EmailService emailService;

	//Gửi email
    @GetMapping("/send")
    public String sendEmail(@RequestParam String to, 
                            @RequestParam String subject, 
                            @RequestParam String text) {
        try {
            emailService.sendEmail(to, subject, text);
            return "Email đã được gửi thành công!";
        } catch (MessagingException e) {
            return "Lỗi khi gửi email: " + e.getMessage();
        }
    }
}
