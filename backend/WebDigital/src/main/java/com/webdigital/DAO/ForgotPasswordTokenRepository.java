package com.webdigital.DAO;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.webdigital.Model.ForgotPasswordToken;

@Repository
public interface ForgotPasswordTokenRepository extends JpaRepository<ForgotPasswordToken, Long> {

	Optional<ForgotPasswordToken> findByToken(String token);

}
