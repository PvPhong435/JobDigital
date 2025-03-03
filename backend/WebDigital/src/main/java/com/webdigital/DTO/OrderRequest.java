package com.webdigital.DTO;

import java.util.List;

import com.webdigital.Model.OrderDetail;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderRequest {
	 private Long userID;
	 private List<OrderDetail> orderDetails;
}
