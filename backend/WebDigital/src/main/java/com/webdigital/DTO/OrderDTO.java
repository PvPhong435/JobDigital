package com.webdigital.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
	private Long userId;        // ID của người dùng đặt hàng
    private LocalDateTime orderDate; // Ngày đặt hàng
    private BigDecimal totalAmount;  // Tổng tiền đơn hàng
    private String status;      // Trạng thái đơn hàng (pending, completed, canceled, etc.)
}
