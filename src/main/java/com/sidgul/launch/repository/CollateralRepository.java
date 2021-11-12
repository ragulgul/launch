package com.sidgul.launch.repository;

import com.sidgul.launch.domain.Collateral;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Collateral entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CollateralRepository extends JpaRepository<Collateral, Long> {}
