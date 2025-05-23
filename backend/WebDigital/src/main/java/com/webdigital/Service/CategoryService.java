package com.webdigital.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.webdigital.DAO.CategoryRepository;
import com.webdigital.Model.Category;

@Service
public class CategoryService {
	 @Autowired
	    private CategoryRepository categoryRepository;

	    public List<Category> getAllCategories() {
	        return categoryRepository.findAll();
	    }
}
