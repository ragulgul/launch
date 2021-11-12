package com.sidgul.launch.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.sidgul.launch.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CollateralTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Collateral.class);
        Collateral collateral1 = new Collateral();
        collateral1.setId(1L);
        Collateral collateral2 = new Collateral();
        collateral2.setId(collateral1.getId());
        assertThat(collateral1).isEqualTo(collateral2);
        collateral2.setId(2L);
        assertThat(collateral1).isNotEqualTo(collateral2);
        collateral1.setId(null);
        assertThat(collateral1).isNotEqualTo(collateral2);
    }
}
