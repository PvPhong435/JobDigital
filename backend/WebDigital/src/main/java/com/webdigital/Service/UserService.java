package com.webdigital.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import com.webdigital.DAO.UserRepository;
import com.webdigital.Model.User;

import jakarta.transaction.Transactional;

@Service
public class UserService {
	@Autowired
	private UserRepository userRepository;

	// Lấy danh sách tất cả người dùng
	public List<User> getAllUsers() {
		return userRepository.findAll();
	}

	// Lấy thông tin người dùng theo ID
	public Optional<User> getUserById(Long id) {
		return userRepository.findById(id);
	}

	// Thêm người dùng mới
	@Transactional
	public User createUser(User user) {
//	    	if (user.getUserID() != null) {
//	    	    user = userRepository.findById(user.getUserID()).orElse(user);
//	    	}

		if (user.getUserID() != null && userRepository.existsById(user.getUserID())) {
			throw new IllegalArgumentException("User đã tồn tại, không thể thêm mới!");
		}
		//user.setUserID(null);
		return userRepository.saveAndFlush(user);
	}

	// Cập nhật thông tin người dùng
	public Optional<User> updateUser(Long id, User userDetails) {
		return userRepository.findById(id).map(user -> {
			user.setUsername(userDetails.getUsername());
			user.setEmail(userDetails.getEmail());
			user.setPassword(userDetails.getPassword());

			try {
				return userRepository.saveAndFlush(user); // Dùng saveAndFlush để commit ngay
			} catch (ObjectOptimisticLockingFailureException e) {
				throw new RuntimeException("Người dùng đã bị thay đổi, vui lòng thử lại!");
			}
		});
	}

	// Xóa người dùng theo ID
	public boolean deleteUser(Long id) {
		if (userRepository.existsById(id)) {
			userRepository.deleteById(id);
			return true;
		}
		return false;
	}

}
