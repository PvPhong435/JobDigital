package com.webdigital.DAO;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.webdigital.Model.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long>  {

}
