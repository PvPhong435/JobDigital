package com.webdigital.Controller;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.webdigital.DAO.CartRepository;
import com.webdigital.DAO.ProductRepository;
import com.webdigital.DTO.CartRequest;
import com.webdigital.DTO.CartShow;
import com.webdigital.DTO.CartUpdateRequest;
import com.webdigital.Model.*;
import com.webdigital.Service.CartService;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {

	 @Autowired
	    private CartService cartService;

	    // Thêm sản phẩm vào giỏ hàng
	 @PostMapping("/add")
	 public ResponseEntity<Map<String, String>> addToCart(@RequestBody CartRequest request) {
	     Map<String, String> response = new HashMap<>();
	     try {
	         cartService.addToCart(request.getUserID(), request.getProductID(), request.getQuantity());
	         response.put("message", "Product added to cart successfully.");
	         return ResponseEntity.ok(response); // ✅ Trả về JSON hợp lệ
	     } catch (IllegalArgumentException e) {
	         response.put("error", e.getMessage());
	         return ResponseEntity.badRequest().body(response); // ✅ Trả về JSON hợp lệ
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
	    public ResponseEntity<List<CartShow>> getUserCart(@PathVariable Long userID) {
	    	List<CartShow> cartItems = ConvertToCartShow(cartService.getUserCart(userID));
	    	if(cartItems.size()==0)
	    	{
	    		return ResponseEntity.ok(cartItems=new ArrayList<CartShow>());
	    	}
	    	else
	    	{
	    		return ResponseEntity.ok(cartItems);
	    	}
	        
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
	    
	    
	    private List<CartShow> ConvertToCartShow(List<Cart> list)
	    {
	    	List<CartShow> listNew=new ArrayList<CartShow>();
	    	for(Cart c :list)
	    	{
	    		CartShow cartNew= new CartShow();
	    		cartNew.setCartId(c.getCartID());
	    		cartNew.setProductName(c.getProduct().getProductName());
	    		cartNew.setPrice(c.getProduct().getPrice());
	    		cartNew.setQuantity(c.getQuantity());
	    		cartNew.setUserId(c.getUser().getUserID());
	    		cartNew.setUserName(c.getUser().getUsername());
	    		cartNew.setProductImage(c.getProduct().getImageURL());
	    		listNew.add(cartNew);	
	    	}
	    	
	    	return listNew;
	    }
}
