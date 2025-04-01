package com.webdigital.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderAdminDTO {
	private Long orderID;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private String status;
    private Long userID;
    private String userName;
    private List<OrderDetailDTO2> orderDetails;
}
