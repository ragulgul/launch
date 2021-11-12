package com.sidgul.launch.repository;

import com.sidgul.launch.domain.Launch;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Launch entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LaunchRepository extends JpaRepository<Launch, Long> {}
