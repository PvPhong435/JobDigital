package com.webdigital.Controller;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import com.webdigital.DAO.ForgotPasswordTokenRepository;
import com.webdigital.DAO.UserRepository;
import com.webdigital.Model.ForgotPasswordToken;
import com.webdigital.Model.User;
import com.webdigital.Service.EmailService;

import jakarta.mail.MessagingException;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
    private UserRepository userRepository;
	
	 @Autowired
	 private EmailService emailService;
	    

    @Autowired
    private ForgotPasswordTokenRepository tokenRepository;

    // Đăng ký người dùng mới
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user,HttpSession session) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        // Không sử dụng PasswordEncoder, có thể tự mã hóa nếu cần
        user.setCreatedAt(LocalDateTime.now());
        User savedUser = userRepository.save(user);
        session.setAttribute("loggedInUser", user);
        return ResponseEntity.ok(savedUser);
    }

    // Đăng nhập
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody LoginRequest loginRequest, HttpSession session) {
        Optional<User> user = userRepository.findByEmail(loginRequest.getEmail());
        if (user.isPresent() && user.get().getPassword().equals(loginRequest.getPassword())) { // So sánh trực tiếp
        	session.setAttribute("loggedInUser", user);
            return ResponseEntity.ok("Đăng nhập thành công");
        } else {
            return ResponseEntity.status(401).body("Email hoặc mật khẩu không đúng");
        }
    }

    // Quên mật khẩu (không sài)
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            String token = UUID.randomUUID().toString();
            ForgotPasswordToken forgotPasswordToken = new ForgotPasswordToken(null, user.get(), token, LocalDateTime.now().plusHours(1));
            tokenRepository.save(forgotPasswordToken);

            // Gửi email với mã token (mô phỏng)
            
            return ResponseEntity.ok("Token quên mật khẩu đã được gửi: " + token);
        } else {
            return ResponseEntity.badRequest().body("Email không tồn tại trong hệ thống");
        }
    }

    // Đổi mật khẩu
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        Optional<ForgotPasswordToken> optionalToken = tokenRepository.findByToken(token);
        if (optionalToken.isPresent() && optionalToken.get().getExpiration().isAfter(LocalDateTime.now())) {
            User user = optionalToken.get().getUser();
            user.setPassword(newPassword); // Không mã hóa mật khẩu
            userRepository.save(user);

            tokenRepository.delete(optionalToken.get());
            return ResponseEntity.ok("Mật khẩu đã được cập nhật thành công");
        } else {
            return ResponseEntity.badRequest().body("Token không hợp lệ hoặc đã hết hạn");
        }
    }
    
    // Quên mật khẩu (đang sài)
    @PostMapping("/forgot-password2")
    public ResponseEntity<String> forgotPassword2(@RequestParam String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            String token = generateRandomCode(6); // Tạo mã ngẫu nhiên 6 chữ số
            ForgotPasswordToken forgotPasswordToken = new ForgotPasswordToken(null, user.get(), token, LocalDateTime.now().plusHours(1));
            tokenRepository.save(forgotPasswordToken);

            // Gửi email với mã token
            String subject = "Mã xác thực quên mật khẩu";
            String message = "Bạn đã yêu cầu thay đổi mật khẩu. Mã xác thực của bạn là: " + token;
            try {
                emailService.sendEmail(email, subject, message); // Gọi dịch vụ gửi email
                return ResponseEntity.ok("Mã xác thực đã được gửi đến email của bạn.");
            } catch (MessagingException e) {
                return ResponseEntity.status(500).body("Lỗi khi gửi email: " + e.getMessage());
            }
        } else {
            return ResponseEntity.badRequest().body("Email không tồn tại trong hệ thống");
        }
    }
    
    @GetMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate(); // Xóa session khi logout
        return ResponseEntity.ok("Đăng xuất thành công");
    }
    // Dữ liệu yêu cầu đăng nhập
    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
    
    private String generateRandomCode(int length) {
        Random random = new Random();
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < length; i++) {
            code.append(random.nextInt(10)); // Tạo một số ngẫu nhiên từ 0 đến 9
        }
        return code.toString();
    }
}
