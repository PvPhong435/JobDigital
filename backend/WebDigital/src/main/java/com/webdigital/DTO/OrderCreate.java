package com.webdigital.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.webdigital.Model.User;

import lombok.Data;

@Data
public class OrderCreate {
	private Long userId;
	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private LocalDateTime orderDate;
	private BigDecimal totalAmount;
	private String status;
	
}
 