package com.webdigital.Service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.webdigital.DTO.ProductDTO;
import com.webdigital.Model.Product;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private ProductService productService;

    public void sendOrderEmail(String to, String subject, List<ProductDTO> productList, String orderDate, double totalAmount) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom("your-email@gmail.com");
        helper.setTo(to);
        helper.setSubject(subject);

        // Lấy danh sách sản phẩm đầy đủ thông tin từ DB
        List<ProductDTO> detailedProducts = productService.getProductDetails(productList);

        // Tạo nội dung email
        StringBuilder emailContent = new StringBuilder();
        emailContent.append("<h2>Đơn hàng của bạn đã đặt thành công!</h2>");
        emailContent.append("<p><b>Ngày đặt hàng:</b> " + orderDate + "</p>");
        emailContent.append("<p><b>Tổng tiền:</b> " + totalAmount + " VND</p>");
        emailContent.append("<h3>Chi tiết sản phẩm:</h3>");
        emailContent.append("<table border='1' cellpadding='5' cellspacing='0'>");
        emailContent.append("<tr><th>Tên sản phẩm</th><th>Số lượng</th><th>Giá</th><th>Thành tiền</th></tr>");

        for (ProductDTO p : detailedProducts) {
            emailContent.append("<tr>")
                .append("<td>").append(p.getProductName()).append("</td>") 
                .append("<td>").append(p.getQuantity()).append("</td>")
                .append("<td>").append(p.getPrice()).append(" VND</td>")
                .append("<td>").append(p.getPrice().multiply(BigDecimal.valueOf(p.getQuantity()))
).append(" VND</td>")
                .append("</tr>");
        }
        emailContent.append("</table>");
        emailContent.append("<p>Cảm ơn bạn đã mua hàng!</p>");

        helper.setText(emailContent.toString(), true); // Cho phép HTML

        mailSender.send(message);
    }
}
