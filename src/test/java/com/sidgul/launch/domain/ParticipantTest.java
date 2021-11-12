package com.sidgul.launch.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.sidgul.launch.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ParticipantTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Participant.class);
        Participant participant1 = new Participant();
        participant1.setId(1L);
        Participant participant2 = new Participant();
        participant2.setId(participant1.getId());
        assertThat(participant1).isEqualTo(participant2);
        participant2.setId(2L);
        assertThat(participant1).isNotEqualTo(participant2);
        participant1.setId(null);
        assertThat(participant1).isNotEqualTo(participant2);
    }
}
