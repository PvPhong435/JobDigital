package com.webdigital.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
	    
}
