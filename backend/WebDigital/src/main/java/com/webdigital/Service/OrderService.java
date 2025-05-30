package com.webdigital.Service;
import com.webdigital.DAO.OrderRepository;
import com.webdigital.DAO.ProductRepository;
import com.webdigital.DAO.UserRepository;
import com.webdigital.DTO.OrderAdminDTO;
import com.webdigital.DTO.OrderCreate;
import com.webdigital.DTO.OrderDTO;
import com.webdigital.DTO.OrderDetailDTO;
import com.webdigital.DTO.OrderDetailDTO2;
import com.webdigital.DTO.UpdateOrderStatusDTO;
import com.webdigital.DAO.OrderDetailRepository;
import com.webdigital.Model.Order;
import com.webdigital.Model.OrderDetail;
import com.webdigital.Model.Product;
import com.webdigital.Model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {
	 @Autowired
	    private OrderRepository orderRepository;

	    @Autowired
	    private OrderDetailRepository orderDetailRepository;

	    @Autowired
	    private UserService userService;
	    
	    @Autowired
	    private UserRepository userRepository;

	    @Autowired
	    private ProductService productService;

	    public List<Order> getOrdersByUser(Long userID) {
	        return orderRepository.findByUser_UserID(userID);
	    }

	    public Optional<Order> getOrderById(Long orderID) {
	        return orderRepository.findById(orderID);
	    }
	    
	    public List<Order> getAll()
	    {
	    	return orderRepository.findAll();
	    }

//	    public Order createOrder(OrderDTO orderDTO) {
//	        User user = userService.getUserById(orderDTO.getUserID())
//	            .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại!"));
//
//	        Order order = new Order();
//	        order.setUser(user);
//	        order.setOrderDate(LocalDateTime.now());
//
//	        List<OrderDetail> orderDetails = new ArrayList<>();
//	        Long totalAmount=(long) 0;
//	        for (OrderDetailDTO dto : orderDTO.getOrderDetails()) {
//	            Product product = productService.getProductById(dto.getProductID())
//	                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại!"));
//
//	            OrderDetail orderDetail = new OrderDetail();
//	            orderDetail.setProduct(product);
//	            orderDetail.setQuantity(dto.getQuantity());
//	            orderDetail.setPrice(product.getPrice()); // Nếu giá lấy từ sản phẩm
//	            totalAmount+=(product.getPrice().longValue()*dto.getQuantity());
//	            orderDetail.setOrder(order);
//	            orderDetails.add(orderDetail);
//	            
//	        }
//	        BigDecimal total=BigDecimal.valueOf(totalAmount);
//	        order.setTotalAmount(total);
//	        order.setOrderDetails(orderDetails);
//	        return orderRepository.save(order);
//	    }
	    
	    public Order AddNewOrder(OrderCreate order)
	    {
	    	User user= userRepository.getById(order.getUserId());
	    	 Order orderAdd = new Order();
	    	 orderAdd.setUser(user);
	    	 orderAdd.setOrderDate(LocalDateTime.now());
	    	 orderAdd.setTotalAmount(order.getTotalAmount());
	    	 orderAdd.setStatus(order.getStatus());
	    	 return orderRepository.save(orderAdd);
	    }

	    public boolean deleteOrder(Long orderID) {
	        if (orderRepository.existsById(orderID)) {
	            orderRepository.deleteById(orderID);
	            return true;
	        }
	        return false;
	    }

	    public Optional<Order> updateOrderStatus(Long orderID, String status) {
	        Optional<Order> optionalOrder = orderRepository.findById(orderID);
	        if (optionalOrder.isPresent()) {
	            Order order = optionalOrder.get();
	            order.setStatus(status);
	            return Optional.of(orderRepository.save(order));
	        }
	        return Optional.empty();
	    }
	    
	 // Lấy tất cả orders và chuyển thành OrderAdminDTO
	    public List<OrderAdminDTO> getAllOrdersForAdmin() {
	        List<Order> orders = orderRepository.findAll();
	        return orders.stream().map(this::convertToOrderAdminDTO).collect(Collectors.toList());
	    }
	    
	 // Cập nhật trạng thái đơn hàng
	    public void updateOrderStatus(Long orderId, UpdateOrderStatusDTO updateOrderStatusDTO) {
	        Order order = orderRepository.findById(orderId)
	            .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId));
	        
	        // Cập nhật trạng thái
	        order.setStatus(updateOrderStatusDTO.getStatus());
	        orderRepository.save(order);
	    }
	    
	 // Chuyển đổi từ Order sang OrderAdminDTO
	    private OrderAdminDTO convertToOrderAdminDTO(Order order) {
	        // Chuyển danh sách OrderDetail sang OrderDetailDTO
	        List<OrderDetailDTO2> orderDetailDTOs = order.getOrderDetails().stream()
	            .map(detail -> new OrderDetailDTO2(
	                detail.getOrderDetailID(),
	                detail.getQuantity(),
	                detail.getPrice(),
	                detail.getProduct().getProductName(),
	                detail.getProduct().getImageURL()
	            ))
	            .collect(Collectors.toList());

	        // Tạo OrderAdminDTO
	        OrderAdminDTO odp=new OrderAdminDTO();
	        odp.setOrderDate(order.getOrderDate());
	        odp.setOrderDetails(orderDetailDTOs);
	        odp.setOrderID(order.getOrderID());
	        odp.setStatus(order.getStatus());
	        odp.setTotalAmount(order.getTotalAmount());
	        odp.setUserID(order.getUser().getUserID());
	        odp.setUserName(order.getUser().getUsername());
	        
	        return odp;
	    }
}
