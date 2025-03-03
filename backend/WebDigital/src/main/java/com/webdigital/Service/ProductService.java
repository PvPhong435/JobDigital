package com.webdigital.Service;

import com.webdigital.Model.Product;
import com.webdigital.DAO.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getProductsByCategory(Long categoryID) {
        return productRepository.findByCategory_CategoryID(categoryID);
    }
    
    public List<Product> getRandomProducts() {
        return productRepository.findRandomProductsOptimized();
    }
    
    public Optional<Product> getProductById(Long id)
    {
    	return productRepository.findById(id);
    }
    
    public Product createProduct(Product productAdd)
    {
    	
    	return productRepository.save(productAdd);
    }
    
    public Product UpdateProduct(Product productUpdate)
    {
    	
    	return productRepository.save(productUpdate);
    }
}