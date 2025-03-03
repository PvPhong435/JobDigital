package com.webdigital.Model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="orderid")
    private Long orderID;

    @Column(nullable = true, columnDefinition = "timestamp default current_timestamp",name="orderdate")
    private LocalDateTime orderDate;

    @Column(nullable = true, precision = 10, scale = 2,name="totalamount")
    private BigDecimal totalAmount;

    @Column(length = 15, nullable = true, columnDefinition = "varchar(15) default 'Pending'")
    private String status;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderDetail> orderDetails = new ArrayList<>();
    
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "userid", foreignKey = @ForeignKey(name = "FK_Order_User"))
    private User user;
}
