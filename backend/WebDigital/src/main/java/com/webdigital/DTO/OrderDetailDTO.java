package com.webdigital.DTO;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class OrderDetailDTO {
	@JsonProperty("productId")
    private Long productID;
    private Integer quantity;
    private BigDecimal price;
}
