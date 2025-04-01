package com.webdigital.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
	private long categoryId;
	private String categoryName;
	private String description;
	
}
