package com.webdigital.Controller;

import com.webdigital.DTO.OrderDTO;
import com.webdigital.DTO.OrderRequest;
import com.webdigital.DTO.OrderStatus;
import com.webdigital.Model.Order;
import com.webdigital.Model.OrderDetail;
import com.webdigital.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
	@Autowired
    private OrderService orderService;

    // Lấy danh sách đơn hàng của người dùng
    @GetMapping("/{userID}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable Long userID) {
        List<Order> orders = orderService.getOrdersByUser(userID);
        return ResponseEntity.ok(orders);
    }

    // Xem chi tiết đơn hàng
    @GetMapping("/details/{orderID}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderID) {
        Optional<Order> order = orderService.getOrderById(orderID);
        return order.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Tạo đơn hàng mới
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderDTO orderDTO) {
        Order order = orderService.createOrder(orderDTO);
        return ResponseEntity.ok(order);
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
}
