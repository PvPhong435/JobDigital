package com.webdigital.Model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentID;

    @ManyToOne
    @JoinColumn(name = "orderID", foreignKey = @ForeignKey(name = "FK_Payment_Order"))
    private Order order;

    @Column(nullable = false, length = 50)
    private String paymentMethod;

    @Column(nullable = false, columnDefinition = "timestamp default current_timestamp")
    private LocalDateTime paymentDate;

    @Column(length = 10, nullable = false, columnDefinition = "varchar(10) default 'Unpaid'")
    private String paymentStatus;
}
