package com.webdigital.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderAdd {
	private Long orderID;
	private Long userID;
	private LocalDateTime orderDate;
	private BigDecimal totalAmount;
	private String status;
	
}
