package com.sidgul.launch.repository;

import com.sidgul.launch.domain.ProductLine;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ProductLine entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductLineRepository extends JpaRepository<ProductLine, Long> {}
