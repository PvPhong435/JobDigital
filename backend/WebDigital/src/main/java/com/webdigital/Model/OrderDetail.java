package com.webdigital.Model;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orderdetails")
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="orderdetailid")
    private Long orderDetailID;

    @Column(nullable = true)
    private Integer quantity;

    @Column(nullable = true, precision = 10, scale = 2)
    private BigDecimal price;
    
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "orderid", foreignKey = @ForeignKey(name = "FK_OrderDetail_Order"))
    private Order order;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "productid", foreignKey = @ForeignKey(name = "FK_OrderDetail_Product"))
    private Product product;
}