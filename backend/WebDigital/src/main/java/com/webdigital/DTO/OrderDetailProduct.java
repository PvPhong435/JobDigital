package com.webdigital.DTO;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailProduct {
	private Long orderId;
	private String productName;
	private String productImg;
	private Integer quantity;
	private BigDecimal price;
}
