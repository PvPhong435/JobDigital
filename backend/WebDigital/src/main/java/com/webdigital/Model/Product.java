package com.webdigital.Model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="productid")
    private Long productID;

    @Column(nullable = true, length = 100,name="productname")
    private String productName;
    
    @Column(nullable = true, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = true, columnDefinition = "int default 0")
    private Integer stock;

    private String description;

    @Column(name="imageurl")
    private String imageURL;

    @Column(nullable = true, columnDefinition = "timestamp default current_timestamp",name="createdat")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderDetail> orderDetails;
    
//    @ManyToMany(mappedBy = "products")
//    private List<Cart> carts; // Liên kết ngược với Cart
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoryid", foreignKey = @ForeignKey(name = "FK_Product_Category"))
    private Category category;
}
