package com.webdigital.DTO;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailOrder {
	private String userId;
	private String userName;
	private String phone;
	private String email;
	private String address;
	private List<ProductListDTO> productList;
}
