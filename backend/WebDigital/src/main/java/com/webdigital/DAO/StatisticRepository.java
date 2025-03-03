package com.webdigital.DAO;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.webdigital.Model.Statistic;

@Repository
public interface StatisticRepository extends JpaRepository<Statistic, Long>  {

}
