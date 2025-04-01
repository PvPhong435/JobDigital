package com.webdigital.Controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.webdigital.DTO.CategoryDTO;
import com.webdigital.Model.Category;
import com.webdigital.Service.CategoryService;

@RestController
@RequestMapping("/api/category")
public class CategoryController {
	@Autowired
	private CategoryService categoryService;

	// Lấy danh sách các loại sản phẩm
	@GetMapping
	public List<Category> getAllCategories() {
		return categoryService.getAllCategories();
	}
	
	@GetMapping("/admin")
	public List<CategoryDTO> getAllCategoriesAdmin() {
		return convertToCategoryDTO(categoryService.getAllCategories());
	}

	private List<CategoryDTO> convertToCategoryDTO(List<Category> listCategory) 
	{
		List<CategoryDTO> listNew=new ArrayList<CategoryDTO>();
		for(Category cat:listCategory)
		{
			CategoryDTO cateDto=new CategoryDTO();
			cateDto.setCategoryId(cat.getCategoryID());
			cateDto.setCategoryName(cat.getCategoryName());
			cateDto.setDescription(cat.getDescription());
			listNew.add(cateDto);
		}
		return listNew;
	}

}
