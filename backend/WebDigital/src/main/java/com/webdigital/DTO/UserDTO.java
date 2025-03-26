package com.webdigital.DTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
	 private Long userId;    // ID của người dùng
	 private String userName; // Họ và tên
	 private String phone;    // Số điện thoại
	 private String email;    // Email
	 private String address;  // Địa chỉ nhận hàng
}
