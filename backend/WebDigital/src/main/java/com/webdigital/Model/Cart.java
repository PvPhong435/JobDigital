package com.webdigital.Model;

import java.util.HashMap;
import java.util.Map;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "cart")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cartid")
    private Long cartID;

    @ManyToOne
    @JoinColumn(name = "userid", referencedColumnName = "userid")
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "productid", nullable = false, foreignKey = @ForeignKey(name = "FK_Cart_Product"))
    private Product product;

    @Column(nullable = false)
    private Integer quantity;
}