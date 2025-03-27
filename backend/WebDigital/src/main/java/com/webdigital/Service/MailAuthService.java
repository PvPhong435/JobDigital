package com.webdigital.Service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailAuthService {
	@Autowired
    private JavaMailSender mailSender;
	
	public void sendVerificationEmail(Map<String, String> request) {
        String email = request.get("email");
        String verificationCode = request.get("verificationCode");

        if (email == null || verificationCode == null) {
            throw new IllegalArgumentException("Email và mã xác thực không được để trống!");
        }

        // Tạo email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Mã Xác Thực Của Bạn");
        message.setText("Mã xác thực của bạn là: " + verificationCode + "\nVui lòng không chia sẻ mã này với ai.");
        message.setFrom("cuonglvps26847@fpt.edu.vn"); // Đổi thành email của bạn

        // Gửi email
        mailSender.send(message);
    }
}
