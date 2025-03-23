package com.webdigital.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import com.webdigital.DAO.ProductRepository;
import com.webdigital.Model.Product;
import com.webdigital.Service.ProductService;

import jakarta.transaction.Transactional;

@RestController
@Transactional
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductService productService;

    // Lấy danh sách tất cả sản phẩm
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return ResponseEntity.ok(products);
    }

    // Lấy thông tin sản phẩm theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        return product.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Thêm sản phẩm mới
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product savedProduct = productService.createProduct(product);
        return ResponseEntity.ok(savedProduct);
    }
    
    // Cập nhật thông tin sản phẩm
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Optional<Product> optionalProduct = productRepository.findById(id);

        if (optionalProduct.isPresent()) {
            Product existingProduct = optionalProduct.get();
            existingProduct.setProductName(productDetails.getProductName());
            existingProduct.setPrice(productDetails.getPrice());
            existingProduct.setStock(productDetails.getStock());
            existingProduct.setDescription(productDetails.getDescription());
            existingProduct.setImageURL(productDetails.getImageURL());
            existingProduct.setCategory(productDetails.getCategory());

            Product updatedProduct = productRepository.save(existingProduct);
            return ResponseEntity.ok(updatedProduct);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Xóa sản phẩm theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // lấy sản phẩm theo loại được chọn
    @GetMapping("/category/{categoryID}")
    public List<Product> getProductsByCategory(@PathVariable Long categoryID) {
        return productService.getProductsByCategory(categoryID);
    }
    
    //lấy 5 sản phẩm bán chạy nhất theo dạng random
    @GetMapping("/random")
    public List<Product> getRandomProducts() {
        return productService.getRandomProducts();
    }
    
    //Lấy sản phẩm có cùng loại với ản phẩm được truyền vào
    @GetMapping("/productCategory/{productId}")
    public List<Product> getProductWithSameCategory(@PathVariable Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

        if (product.getCategory() == null) {
            throw new RuntimeException("Product does not have a category.");
        }

        Long categoryId = product.getCategory().getCategoryID();
        return productRepository.findByCategory_CategoryID(categoryId);
    }
    
    @GetMapping("/findByName/{productName}")
    public List<Product> FindProductByName(@PathVariable String productName)
    {
    	return productRepository.findByProductNameContainingIgnoreCase(productName);
    }

    
    
}
