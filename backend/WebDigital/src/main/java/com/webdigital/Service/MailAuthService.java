package com.webdigital.Service;

import java.math.BigDecimal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.webdigital.DAO.ProductRepository;
import com.webdigital.DTO.EmailOTP;
import com.webdigital.DTO.EmailOrder;
import com.webdigital.DTO.ProductListDTO;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class MailAuthService {
	@Autowired
    private JavaMailSender mailSender;
	
	@Autowired
	private ProductRepository prodRepository;
	
	public void sendVerificationEmail(EmailOTP request) {
        String email = request.getEmail();
        String verificationCode = request.getOtp();

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
	
	public void sendOrderEmail(EmailOrder order) throws MessagingException {
        String toEmail = order.getEmail(); // Lấy email người nhận
        String subject = "Xác nhận đơn hàng từ WebDigital";

        // Tạo nội dung email
        StringBuilder content = new StringBuilder();
        content.append("<h2>Chào ").append(order.getUserName()).append(",</h2>");
        content.append("<p>Cảm ơn bạn đã đặt hàng! Dưới đây là thông tin đơn hàng của bạn:</p>");
        content.append("<p><strong>Họ tên:</strong> ").append(order.getUserName()).append("</p>");
        content.append("<p><strong>Số điện thoại:</strong> ").append(order.getPhone()).append("</p>");
        content.append("<p><strong>Địa chỉ:</strong> ").append(order.getAddress()).append("</p>");
        
        content.append("<h3>Danh sách sản phẩm:</h3>");
        content.append("<table border='1' cellpadding='5' cellspacing='0'>");
        content.append("<tr><th>Tên SP</th><th>Số lượng</th><th>Giá</th></tr>");

        BigDecimal total = BigDecimal.ZERO;
        for (ProductListDTO product : order.getProductList()) {
            content.append("<tr>");
            content.append("<td>").append(prodRepository.getById(product.getProductId()).getProductName()).append("</td>");
            content.append("<td>").append(product.getQuantity()).append("</td>");
            content.append("<td>").append(product.getPrice()).append("</td>");
            content.append("</tr>");
            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(product.getQuantity())));
        }

        content.append("</table>");
        content.append("<h3>Tổng tiền: ").append(total).append(" VND</h3>");
        content.append("<p>Chúng tôi sẽ sớm liên hệ với bạn để xác nhận đơn hàng.</p>");
        content.append("<p>Trân trọng,</p>");
        content.append("<p><strong>WebDigital</strong></p>");

        // Gửi email
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText(content.toString(), true); // true để gửi HTML

        mailSender.send(message);
    }
}
