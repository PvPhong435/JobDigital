package com.webdigital.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductCategoryDTO {
	private long productId;
	private String productName;
	private long categoryId;
	private String categoryName;
	private BigDecimal price;
	private Integer stock;
	private String description;
	private String imageUrl;
	private LocalDateTime createdAt;
}
