package com.webdigital.DTO;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartShow {
	private Long cartId;
	private Long userId;
	private String userName;
	private String productName;
	private Integer quantity;
	private BigDecimal price;
	private String productImage;
}
