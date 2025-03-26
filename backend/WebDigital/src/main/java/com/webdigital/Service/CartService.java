package com.webdigital.Service;
import com.webdigital.DAO.CartRepository;
import com.webdigital.DAO.ProductRepository;
import com.webdigital.DAO.UserRepository;
import com.webdigital.Model.Cart;
import com.webdigital.Model.Product;
import com.webdigital.Model.User;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {
	 @Autowired
	    private CartRepository cartRepository;

	    @Autowired
	    private UserRepository userRepository;

	    @Autowired
	    private ProductRepository productRepository;

	    // Thêm sản phẩm vào giỏ hàng
	    @Transactional
	    public Cart addToCart(Long userID, Long productID, int quantity) {
	        // Tìm người dùng và sản phẩm
	        User user = userRepository.findById(userID)
	                .orElseThrow(() -> new IllegalArgumentException("User not found"));
	        Product product = productRepository.findById(productID)
	                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

	        // Kiểm tra tồn kho sản phẩm
	        if (product.getStock() < quantity) {
	            throw new IllegalArgumentException("Insufficient stock for the product.");
	        }

	        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
	        Optional<Cart> existingCart = cartRepository.findByUser_UserIDAndProduct_ProductID(userID, productID);
	        if (existingCart.isPresent()) {
	            Cart cart = existingCart.get();
	            cart.setQuantity(cart.getQuantity() + quantity);  // Tăng số lượng nếu đã có trong giỏ
	            return cartRepository.save(cart);
	        } else {
	            Cart cart = new Cart();
	            cart.setUser(user);
	            cart.setProduct(product);
	            cart.setQuantity(quantity); 
	            return cartRepository.save(cart);
	        }
	    }

	    // Xóa sản phẩm khỏi giỏ hàng
	    @Transactional
	    public void removeFromCart(Long cartID) {
	        if (!cartRepository.existsById(cartID)) {
	            throw new IllegalArgumentException("Cart item not found");
	        }
	        cartRepository.deleteById(cartID);
	    }
	    
	    @Transactional
	    public void removeFromCart(Long userId, Long productId) {
	        Cart cartItem = cartRepository.findByUser_UserIDAndProduct_ProductID(userId, productId)
	                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));

	        cartRepository.delete(cartItem);
	    }

	    // Cập nhật số lượng sản phẩm trong giỏ hàng
	    @Transactional
	    public Cart updateCartQuantity(Long cartID, int quantity) {
	        Cart cart = cartRepository.findById(cartID)
	                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));

	        if (quantity <= 0) {
	            removeFromCart(cartID);
	            return null;
	        }

	        // Kiểm tra số lượng kho trước khi cập nhật
	        if (cart.getProduct().getStock() < quantity) {
	            throw new IllegalArgumentException("Not enough stock for the product.");
	        }

	        cart.setQuantity(quantity);
	        return cartRepository.save(cart);
	    }

	    // Lấy giỏ hàng của người dùng
	    public List<Cart> getUserCart(Long userID) {
	        return cartRepository.findByUser_UserID(userID);
	    }
	    
	    public Optional<Cart> getCartInfor(Long cartID)
	    {
	    	return cartRepository.findById(cartID);
	    }

	    // Tính tổng tiền trong giỏ hàng
	    public BigDecimal calculateTotal(Long userID) {
	        List<Cart> cartItems = getUserCart(userID);

	        return cartItems.stream()
	                .map(cart -> {
	                    Product product = cart.getProduct();
	                    if (product != null && product.getPrice() != null) {
	                        return product.getPrice().multiply(BigDecimal.valueOf(cart.getQuantity()));
	                    } else {
	                        // Nếu không có sản phẩm hoặc giá của sản phẩm là null, trả về BigDecimal.ZERO
	                        return BigDecimal.ZERO;
	                    }
	                })
	                .reduce(BigDecimal.ZERO, BigDecimal::add);
	    }
	    
	    
}
