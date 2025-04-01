package com.webdigital.Controller;

import com.webdigital.DAO.UserRepository;
import com.webdigital.Model.User;
import com.webdigital.Service.UserService;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@RestController
@RequestMapping("/api/users")
public class UserController {
	 @Autowired
	    private UserService userService;
	 
	 @Autowired
	 private UserRepository userRepository;
	 
	// Lấy thông tin người dùng theo email
	 @GetMapping("/email/{email}")
	 public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
	     Optional<User> user = userService.getUserByEmail(email);
	     
	     if (user.isPresent()) {
	         return ResponseEntity.ok(user.get());  // Trả về thông tin người dùng
	     } else {
	         return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy người dùng với email: " + email);
	     }
	 }

	    // Lấy danh sách tất cả người dùng
	    @GetMapping
	    public ResponseEntity<List<User>> getAllUsers() {
	        List<User> users = userService.getAllUsers();
	        return ResponseEntity.ok(users);
	    }

	    // Lấy thông tin người dùng theo ID
	    @GetMapping("/{id}")
	    public ResponseEntity<User> getUserById(@PathVariable Long id) {
	        Optional<User> user = userService.getUserById(id);
	        return user.map(ResponseEntity::ok)
	                   .orElseGet(() -> ResponseEntity.notFound().build());
	    }
	    
	    // Lấy thông tin người dùng đã login
	    @GetMapping("/isLogin")
	    public ResponseEntity<User> getUserWasLogin(HttpSession session) {
	    	User userLogin = (User) session.getAttribute("loggedInUser");
	    	if(userLogin!=null)
	    	{
	    		return ResponseEntity.ok(userLogin);
	    	}
	    	else
	    	{
	    		System.out.println("Chưa đăng nhập");
	    		return ResponseEntity.ok(null);
	    	}
	    }

	    // Thêm người dùng mới
	    @PostMapping("/addUser")
	    public ResponseEntity<User> createUser(@RequestBody User user) {
	        User savedUser = userService.createUser(user);
	        return ResponseEntity.ok(savedUser);
	    }

	    // Cập nhật thông tin người dùng
	    @PutMapping("/{id}")
	    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
	        Optional<User> userOpt = userRepository.findById(id);
	        if (!userOpt.isPresent()) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User không tồn tại!");
	        }

	        User user = userOpt.get();
	        user.setUsername(updatedUser.getUsername());
	        user.setEmail(updatedUser.getEmail());
	        user.setFullName(updatedUser.getFullName());
	        user.setPhone(updatedUser.getPhone());
	        user.setAddress(updatedUser.getAddress());
	        user.setRole(updatedUser.getRole());

	        // Nếu không có password thì giữ nguyên
	        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
	            user.setPassword(updatedUser.getPassword());
	        }

	        userRepository.save(user);
	        return ResponseEntity.ok(user);
	    }


	    // Xóa người dùng theo ID
	    @DeleteMapping("/{id}")
	    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
	        if (userService.deleteUser(id)) {
	            return ResponseEntity.noContent().build();
	        }
	        return ResponseEntity.notFound().build();
	    }
}
