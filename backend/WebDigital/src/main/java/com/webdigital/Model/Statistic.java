package com.webdigital.Model;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Statistics")
public class Statistic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long statisticID;

    @Column(nullable = false)
    private LocalDate date;

    @Column(precision = 10, scale = 2, columnDefinition = "decimal(10, 2) default 0")
    private BigDecimal totalSales;

    @Column(nullable = false, columnDefinition = "int default 0")
    private Integer totalOrders;

    @Column(nullable = false, columnDefinition = "int default 0")
    private Integer newCustomers;
}
