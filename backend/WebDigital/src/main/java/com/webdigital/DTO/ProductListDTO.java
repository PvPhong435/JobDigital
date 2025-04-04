package com.webdigital.DTO;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductListDTO {
	private long productId;
	private Integer quantity;
	private BigDecimal price;
}
