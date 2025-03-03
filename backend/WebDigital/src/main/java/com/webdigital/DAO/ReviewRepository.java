package com.webdigital.DAO;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.webdigital.Model.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

}
