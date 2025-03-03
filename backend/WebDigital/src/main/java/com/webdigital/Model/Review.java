package com.webdigital.Model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewID;

    @ManyToOne
    @JoinColumn(name = "productID", foreignKey = @ForeignKey(name = "FK_Review_Product"))
    private Product product;

    @ManyToOne
    @JoinColumn(name = "userID", foreignKey = @ForeignKey(name = "FK_Review_User"))
    private User user;

    @Column(nullable = false)
    private Integer rating;

    private String comment;

    @Column(nullable = false, columnDefinition = "timestamp default current_timestamp")
    private LocalDateTime createdAt;
}
