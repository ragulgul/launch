package com.sidgul.launch.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.sidgul.launch.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProductLineTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductLine.class);
        ProductLine productLine1 = new ProductLine();
        productLine1.setId(1L);
        ProductLine productLine2 = new ProductLine();
        productLine2.setId(productLine1.getId());
        assertThat(productLine1).isEqualTo(productLine2);
        productLine2.setId(2L);
        assertThat(productLine1).isNotEqualTo(productLine2);
        productLine1.setId(null);
        assertThat(productLine1).isNotEqualTo(productLine2);
    }
}
