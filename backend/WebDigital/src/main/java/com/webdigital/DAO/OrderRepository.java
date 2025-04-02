package com.webdigital.DAO;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.webdigital.Model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
	List<Order> findByUser_UserID(Long userID);
	
//	// (Tùy chọn) Lấy tất cả orders và sắp xếp theo ngày tạo
//    List<Order> findAllByOrderByorderDateDesc();
	
	@Query("SELECT o FROM Order o WHERE o.status = :status")
	List<Order> findByStatus(@Param("status") String status);
	
	@Query("SELECT o FROM Order o WHERE o.status = :status AND o.orderDate >= :startDate AND o.orderDate <= :endDate")
	List<Order> findByStatusAndDateRange(@Param("status") String status, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
