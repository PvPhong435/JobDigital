package com.webdigital.DTO;

import java.util.List;

import lombok.Data;

@Data
public class OrderDTO {
    private Long userID;
    private List<OrderDetailDTO> orderDetails;
}
