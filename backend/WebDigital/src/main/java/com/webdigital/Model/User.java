package com.webdigital.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userid")
    private Long userID;

    @Column(nullable = true, length = 50)
    private String username;

    @Column(nullable = true, length = 255)
    private String password;

    @Column(nullable = true, length = 100)
    private String email;

    @Column(name="fullname")
    private String fullName;

    @Column(length = 15)
    private String phone;

    private String address;

    @Column(length = 10, nullable = true, columnDefinition = "varchar(10) default 'Customer'")
    private String role;

    @Column(nullable = true, columnDefinition = "timestamp default current_timestamp",name="createdat")
    private LocalDateTime createdAt;
    
}