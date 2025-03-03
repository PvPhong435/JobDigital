package com.webdigital.Controller;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.webdigital.DAO.CartRepository;
import com.webdigital.DAO.ProductRepository;
import com.webdigital.DTO.CartRequest;
import com.webdigital.DTO.CartUpdateRequest;
import com.webdigital.Model.*;
import com.webdigital.Service.CartService;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {

	 @Autowired
	    private CartService cartService;

	    // Thêm sản phẩm vào giỏ hàng
	    @PostMapping("/add")
	    public ResponseEntity<String> addToCart(@RequestBody CartRequest request) {
	        try {
	            cartService.addToCart(request.getUserID(), request.getProductID(), request.getQuantity());
	            return ResponseEntity.ok("Product added to cart successfully.");
	        } catch (IllegalArgumentException e) {
	            return ResponseEntity.badRequest().body(e.getMessage());
	        }
	    }

	    // Xóa sản phẩm khỏi giỏ hàng
	    @DeleteMapping("/remove/{cartID}")
	    public ResponseEntity<String> removeFromCart(@PathVariable Long cartID) {
	        try {
	            cartService.removeFromCart(cartID);
	            return ResponseEntity.ok("Product removed from cart successfully.");
	        } catch (IllegalArgumentException e) {
	            return ResponseEntity.badRequest().body(e.getMessage());
	        }
	    }

	    // Cập nhật số lượng sản phẩm trong giỏ hàng
	    @PutMapping("/update/{cartID}")
	    public ResponseEntity<String> updateCartQuantity(@PathVariable Long cartID, @RequestBody CartUpdateRequest request) {
	        try {
	        	System.out.println(request.getQuantity());
	            cartService.updateCartQuantity(cartID, request.getQuantity());
	            return ResponseEntity.ok("Product quantity updated successfully.");
	        } catch (IllegalArgumentException e) {
	            return ResponseEntity.badRequest().body(e.getMessage());
	        }
	    }

	    // Hiển thị giỏ hàng của người dùng
	    @GetMapping("/user/{userID}")
	    public ResponseEntity<List<Cart>> getUserCart(@PathVariable Long userID) {
	        List<Cart> cartItems = cartService.getUserCart(userID);
	        return ResponseEntity.ok(cartItems);
	    }

	    // Tính tổng tiền trong giỏ hàng
	    @GetMapping("/total/{userID}")
	    public ResponseEntity<BigDecimal> getTotal(@PathVariable Long userID) {
	        BigDecimal total = cartService.calculateTotal(userID);
	        return ResponseEntity.ok(total);
	    }
	    
	    //Hiển thị thông tin giỏ hàng
	    @GetMapping("/{cartID}")
	    public ResponseEntity<Optional<Cart>> getCartInfor(@PathVariable Long cartID)
	    {
	    	Optional<Cart> cartInfor=cartService.getCartInfor(cartID);
	    	return ResponseEntity.ok(cartInfor);
	    }
}
