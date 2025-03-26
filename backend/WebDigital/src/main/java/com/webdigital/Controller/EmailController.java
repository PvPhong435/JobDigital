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

import com.webdigital.DTO.OrderDTO;
import com.webdigital.Model.Product;
import com.webdigital.Service.EmailService;

import jakarta.mail.MessagingException;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

//    @PostMapping("/send")
//    public ResponseEntity<String> sendOrderEmail(@RequestBody OrderDTO order) {
//        try {
//            emailService.sendOrderEmail(
//                order.getUserEmail(),
//                "Xác nhận đơn hàng",
//                order.getProducts(),
//                order.getOrderDate(),
//                order.getTotalAmount()
//            );
//            return ResponseEntity.ok("Email xác nhận đã gửi thành công!");
//        } catch (MessagingException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi gửi email: " + e.getMessage());
//        }
//    }
}
