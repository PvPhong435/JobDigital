package com.webdigital.DTO;

import java.math.BigDecimal;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
	private Long productId;
    private String productName;
    private BigDecimal price;
    private Integer quantity;  // Thêm quantity vào DTO
    private String imageURL;
}
