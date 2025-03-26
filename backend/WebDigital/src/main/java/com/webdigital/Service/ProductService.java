package com.webdigital.Service;

import com.webdigital.Model.Product;
import com.webdigital.DAO.ProductRepository;
import com.webdigital.DTO.ProductDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
    
    public List<ProductDTO> getProductDetails(List<ProductDTO> productList) {
        List<ProductDTO> detailedProducts = new ArrayList<>();

        for (ProductDTO item : productList) {
            // Lấy thông tin sản phẩm từ database theo productId
            Product product = productRepository.findById(item.getProductId()).orElse(null);

            if (product != null) {
                // Chuyển đổi sang ProductDTO
                ProductDTO productDTO = new ProductDTO();
                productDTO.setProductId(product.getProductID());
                productDTO.setProductName(product.getProductName());
                productDTO.setPrice(product.getPrice());
                productDTO.setQuantity(item.getQuantity()); // Giữ nguyên quantity từ FE
                productDTO.setImageURL(product.getImageURL());

                detailedProducts.add(productDTO);
            }
        }

        return detailedProducts;
    }
}