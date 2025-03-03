package com.webdigital.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartRequest {
	 private Long cartID;
	    private Long userID;
	    private Long productID;
	    private int quantity;

}
