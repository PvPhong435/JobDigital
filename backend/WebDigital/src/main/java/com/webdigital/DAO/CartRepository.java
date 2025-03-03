package com.webdigital.DAO;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.webdigital.Model.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long>  {

	Optional<Cart> findByUser_UserIDAndProduct_ProductID(Long userID, Long productID);

	List<Cart> findByUser_UserID(Long userID);

}
