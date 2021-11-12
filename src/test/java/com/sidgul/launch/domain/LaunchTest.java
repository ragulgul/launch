package com.sidgul.launch.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.sidgul.launch.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LaunchTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Launch.class);
        Launch launch1 = new Launch();
        launch1.setId(1L);
        Launch launch2 = new Launch();
        launch2.setId(launch1.getId());
        assertThat(launch1).isEqualTo(launch2);
        launch2.setId(2L);
        assertThat(launch1).isNotEqualTo(launch2);
        launch1.setId(null);
        assertThat(launch1).isNotEqualTo(launch2);
    }
}
