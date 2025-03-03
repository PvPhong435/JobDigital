package com.webdigital.Model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ForgotPasswordTokens")
public class ForgotPasswordToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tokenID;

    @ManyToOne
    @JoinColumn(name = "userID", foreignKey = @ForeignKey(name = "FK_ForgotPasswordToken_User"))
    private User user;

    @Column(nullable = false, length = 255)
    private String token;

    @Column(nullable = false)
    private LocalDateTime expiration;
}
