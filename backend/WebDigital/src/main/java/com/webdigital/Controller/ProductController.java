package com.webdigital.Controller;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.apache.catalina.startup.ClassLoaderFactory.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.webdigital.DAO.CategoryRepository;
import com.webdigital.DAO.ProductRepository;
import com.webdigital.DTO.ProductCategoryDTO;
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

	@Autowired
	private CategoryRepository categoryRepository;
	
	// Thư mục lưu hình ảnh
    private static final String UPLOAD_DIR = "E:/JobDigital/Front/img/";

	// Lấy danh sách tất cả sản phẩm
	@GetMapping
	public ResponseEntity<List<Product>> getAllProducts() {
		List<Product> products = productRepository.findAll();
		return ResponseEntity.ok(products);
	}

	@GetMapping("/admin")
	public ResponseEntity<?> getAllProductsAdmin() {
		List<Product> products = productRepository.findAll();
		products.sort(Comparator.comparing(Product::getProductID));
		return ResponseEntity.ok(convertToProductCategoryDTOList(products));
	}

	// Lấy thông tin sản phẩm theo ID
	@GetMapping("/{id}")
	public ResponseEntity<Product> getProductById(@PathVariable Long id) {
		Optional<Product> product = productRepository.findById(id);
		return product.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}

	// Lấy thông tin sản phẩm theo ID
	@GetMapping("/admin/{id}")
	public ResponseEntity<ProductCategoryDTO> getProductByIdAdmin(@PathVariable Long id) {
		Optional<Product> product = productRepository.findById(id);
		return ResponseEntity.ok(convertToProductCategoryDTO(product.get()));
	}

	// Thêm sản phẩm mới
	@PostMapping
	public ResponseEntity<Product> createProduct(@RequestBody Product product) {
		Product savedProduct = productService.createProduct(product);
		return ResponseEntity.ok(savedProduct);
	}

	// Thêm sản phẩm mới nhận ProductCategoryDTO
	@PostMapping("/admin")
	public ResponseEntity<Product> createProductWithDTO(
            @RequestParam("productName") String productName,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam("price") BigDecimal price,
            @RequestParam("stock") Integer stock,
            @RequestParam("description") String description,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) throws IOException {
        
		System.out.println("Received imageFile: " + (imageFile != null ? imageFile.getOriginalFilename() : "null")); // Debug
        Product product = new Product();
        product.setProductName(productName);
        product.setPrice(price);
        product.setStock(stock);
        product.setDescription(description);
        product.setCategory(categoryRepository.getById(categoryId));
        product.setCreatedAt(LocalDateTime.now());

        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            Files.createDirectories(filePath.getParent()); // Tạo thư mục nếu chưa tồn tại
            Files.write(filePath, imageFile.getBytes());
            product.setImageURL(fileName); // Lưu tên file vào database
        }
        else
        {
        	System.out.println("No image file received");
        }

        Product savedProduct = productRepository.save(product);
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

	// Cập nhật thông tin sản phẩm nhận ProductCategoryDTO
	@PutMapping("/admin/{id}")
	public ResponseEntity<Product> updateProductWithDTO(
            @PathVariable Long id,
            @RequestParam("productName") String productName,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam("price") BigDecimal price,
            @RequestParam("stock") Integer stock,
            @RequestParam("description") String description,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) throws IOException {
        
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            Product existingProduct = optionalProduct.get();
            existingProduct.setProductName(productName);
            existingProduct.setPrice(price);
            existingProduct.setStock(stock);
            existingProduct.setDescription(description);
            existingProduct.setCategory(categoryRepository.getById(categoryId));

            if (imageFile != null && !imageFile.isEmpty()) {
                String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
                Path filePath = Paths.get(UPLOAD_DIR + fileName);
                Files.createDirectories(filePath.getParent());
                Files.write(filePath, imageFile.getBytes());
                // Xóa file cũ nếu cần
                if (existingProduct.getImageURL() != null) {
                    Files.deleteIfExists(Paths.get(UPLOAD_DIR + existingProduct.getImageURL()));
                }
                existingProduct.setImageURL(fileName);
            }

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

	// Xóa sản phẩm theo ID
	@DeleteMapping("/admin/{id}")
	public ResponseEntity<Void> deleteProductadmin(@PathVariable Long id) {
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

	// lấy 5 sản phẩm bán chạy nhất theo dạng random
	@GetMapping("/random")
	public List<Product> getRandomProducts() {
		return productService.getRandomProducts();
	}

	// Lấy sản phẩm có cùng loại với ản phẩm được truyền vào
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
	public List<Product> FindProductByName(@PathVariable String productName) {
		return productRepository.findByProductNameContainingIgnoreCase(productName);
	}

	private List<ProductCategoryDTO> convertToProductCategoryDTOList(List<Product> list) {
		List<ProductCategoryDTO> listNew = new ArrayList<ProductCategoryDTO>();
		for (Product pd : list) {
			ProductCategoryDTO pdc = new ProductCategoryDTO();
			pdc.setCategoryId(pd.getCategory().getCategoryID());
			pdc.setCategoryName(pd.getCategory().getCategoryName());
			pdc.setProductName(pd.getProductName());
			pdc.setDescription(pd.getDescription());
			pdc.setPrice(pd.getPrice());
			pdc.setCreatedAt(pd.getCreatedAt());
			pdc.setProductId(pd.getProductID());
			pdc.setImageUrl(pd.getImageURL());
			pdc.setStock(pd.getStock());
			listNew.add(pdc);
		}
		return listNew;
	}

	private ProductCategoryDTO convertToProductCategoryDTO(Product pd) {

		ProductCategoryDTO pdc = new ProductCategoryDTO();
		pdc.setCategoryId(pd.getCategory().getCategoryID());
		pdc.setCategoryName(pd.getCategory().getCategoryName());
		pdc.setProductName(pd.getProductName());
		pdc.setDescription(pd.getDescription());
		pdc.setPrice(pd.getPrice());
		pdc.setCreatedAt(pd.getCreatedAt());
		pdc.setProductId(pd.getProductID());
		pdc.setImageUrl(pd.getImageURL());
		pdc.setStock(pd.getStock());
		return pdc;
	}

}
