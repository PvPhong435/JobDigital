package com.webdigital.Controller;

import com.webdigital.DAO.OrderDetailRepository;
import com.webdigital.DAO.OrderRepository;
import com.webdigital.DAO.ProductRepository;
import com.webdigital.DTO.OrderAdminDTO;
import com.webdigital.DTO.OrderCreate;
import com.webdigital.DTO.OrderDTO;
import com.webdigital.DTO.OrderDetailDTO;
import com.webdigital.DTO.OrderDetailProduct;
import com.webdigital.DTO.OrderRequest;
import com.webdigital.DTO.OrderStatus;
import com.webdigital.DTO.UpdateOrderStatusDTO;
import com.webdigital.Model.Order;
import com.webdigital.Model.OrderDetail;
import com.webdigital.Model.Product;
import com.webdigital.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
	@Autowired
    private OrderService orderService;
	
	@Autowired 
	private OrderRepository orderRepository;
	
	@Autowired 
	private OrderDetailRepository detailRepository;
	
	@Autowired
	private ProductRepository productRepository;

    // Lấy danh sách đơn hàng của người dùng
    @GetMapping("/{userID}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable Long userID) {
        List<Order> orders = orderService.getOrdersByUser(userID);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping()
    public ResponseEntity<?> getAllOrder()
    {
    	List<Order> orders = orderService.getAll();
    	return ResponseEntity.ok(orders);
    }
    
 // Endpoint để lấy tất cả orders cho admin
    @GetMapping("/admin")
    public ResponseEntity<List<OrderAdminDTO>> getAllOrdersForAdmin() {
        List<OrderAdminDTO> orders = orderService.getAllOrdersForAdmin();
        return ResponseEntity.ok(orders);
    }
    
 // Endpoint để cập nhật trạng thái đơn hàng
    @PutMapping("/{orderId}/status")
    public ResponseEntity<String> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody UpdateOrderStatusDTO updateOrderStatusDTO) {
        try {
            orderService.updateOrderStatus(orderId, updateOrderStatusDTO);
            return ResponseEntity.ok("Cập nhật trạng thái thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi cập nhật trạng thái: " + e.getMessage());
        }
    }

    @GetMapping("/details/{orderID}")
    public ResponseEntity<?> getOrderDetailById(@PathVariable Long orderID) {
        List<OrderDetail> orderDetail = detailRepository.findByOrderOrderID(orderID);
        
        if (orderDetail.size()!=0) {
            return ResponseEntity.ok(ConvertToOrderDetailProduct(orderDetail));
        } else {
            return ResponseEntity.notFound().build();
        }
    }


//    // Tạo đơn hàng mới
//    @PostMapping
//    public ResponseEntity<Order> createOrder(@RequestBody OrderDTO orderDTO) {
//        Order order = orderService.createOrder(orderDTO);
//        return ResponseEntity.ok(order);
//    }
    
    //Tạo order mơi 
    @PostMapping("/addOrder")
    public ResponseEntity<?> CreateNewOrder(@RequestBody OrderCreate order)
    {
    	System.out.println("📥 Nhận order từ FE: " + order);
    	 try {
    	        Order orderAdd = orderService.AddNewOrder(order);
    	        return ResponseEntity.ok(orderAdd); // Trả về JSON chứa orderAdd
    	    } catch (Exception e) {
    	    	System.out.println("❌ Lỗi khi tạo đơn hàng: " + e.getMessage());
    	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi tạo đơn hàng!");
    	    }
    }
    
    @PostMapping("/addOrderDetail/{orderID}")
    public ResponseEntity<?> CreateNewOrderDetail(@PathVariable Long orderID, @RequestBody List<OrderDetailDTO> list) {
        try {
            System.out.println("📥 Nhận được orderID: " + orderID);
            System.out.println("📥 Nhận được danh sách sản phẩm: " + list);

            if (orderID == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("🚨 orderID không được null!");
            }

            if (list == null || list.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("🚨 Danh sách sản phẩm rỗng!");
            }

            Order order = orderRepository.findById(orderID)
                    .orElseThrow(() -> new RuntimeException("❌ Không tìm thấy đơn hàng với ID: " + orderID));

            List<OrderDetail> orderDetails = new ArrayList<>();

            for (OrderDetailDTO dto : list) {
            	 System.out.println("👉 Nhận productId: " + dto.getProductID());
                 System.out.println("👉 Nhận quantity: " + dto.getQuantity());
                 System.out.println("👉 Nhận price: " + dto.getPrice());
                if (dto.getProductID() == null) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("🚨 productId không được null!");
                }

                Product product = productRepository.findById(dto.getProductID())
                        .orElseThrow(() -> new RuntimeException("❌ Không tìm thấy sản phẩm với ID: " + dto.getProductID()));

                OrderDetail orderDetail = new OrderDetail();
                orderDetail.setOrder(order);
                orderDetail.setProduct(product);
                orderDetail.setQuantity(dto.getQuantity());
                orderDetail.setPrice(dto.getPrice());

                orderDetails.add(orderDetail);
            }

            detailRepository.saveAll(orderDetails);

            return ResponseEntity.ok(orderDetails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("🚨 Lỗi hệ thống: " + e.getMessage());
        }
    }
    
    // Cập nhật trạng thái đơn hàng
    @PutMapping("/update/{orderID}")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long orderID, @RequestBody OrderStatus request) {
        Optional<Order> updatedOrder = orderService.updateOrderStatus(orderID, request.getStatus());
        return updatedOrder.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Xóa đơn hàng (hủy đơn)
    @DeleteMapping("/{orderID}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderID) {
        if (orderService.deleteOrder(orderID)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    private List<OrderDetailProduct> ConvertToOrderDetailProduct(List<OrderDetail> list)
    {
    	List<OrderDetailProduct> listNew=new ArrayList<OrderDetailProduct>();
    	for(OrderDetail o:list)
    	{
    		OrderDetailProduct od=new OrderDetailProduct();
    		od.setOrderId(o.getOrder().getOrderID());
    		od.setPrice(o.getPrice());
    		od.setProductName(o.getProduct().getProductName());
    		od.setQuantity(o.getQuantity());
    		od.setProductImg(o.getProduct().getImageURL());
    		listNew.add(od);
    	}
    	return listNew;
    }
}
