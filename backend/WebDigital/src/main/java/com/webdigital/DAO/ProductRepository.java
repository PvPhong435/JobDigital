package com.webdigital.DAO;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.webdigital.Model.Product;

import jakarta.persistence.LockModeType;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
	List<Product> findByCategory_CategoryID(Long categoryID);
	
	@Query(value = "SELECT * FROM products WHERE productid IN (SELECT productid FROM products ORDER BY RANDOM() LIMIT 5)", nativeQuery = true)
	List<Product> findRandomProductsOptimized();

	List<Product> findByProductNameContainingIgnoreCase(String productName);


}
