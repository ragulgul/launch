package com.sidgul.launch.web.rest;

import static com.sidgul.launch.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.sidgul.launch.IntegrationTest;
import com.sidgul.launch.domain.Launch;
import com.sidgul.launch.domain.Product;
import com.sidgul.launch.repository.LaunchRepository;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link LaunchResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LaunchResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_START = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_START = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Integer DEFAULT_VERSION = 1;
    private static final Integer UPDATED_VERSION = 2;

    private static final byte[] DEFAULT_ICON = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_ICON = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_ICON_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_ICON_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/launches";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LaunchRepository launchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLaunchMockMvc;

    private Launch launch;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Launch createEntity(EntityManager em) {
        Launch launch = new Launch()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .start(DEFAULT_START)
            .version(DEFAULT_VERSION)
            .icon(DEFAULT_ICON)
            .iconContentType(DEFAULT_ICON_CONTENT_TYPE);
        // Add required entity
        Product product;
        if (TestUtil.findAll(em, Product.class).isEmpty()) {
            product = ProductResourceIT.createEntity(em);
            em.persist(product);
            em.flush();
        } else {
            product = TestUtil.findAll(em, Product.class).get(0);
        }
        launch.setProduct(product);
        return launch;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Launch createUpdatedEntity(EntityManager em) {
        Launch launch = new Launch()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .start(UPDATED_START)
            .version(UPDATED_VERSION)
            .icon(UPDATED_ICON)
            .iconContentType(UPDATED_ICON_CONTENT_TYPE);
        // Add required entity
        Product product;
        if (TestUtil.findAll(em, Product.class).isEmpty()) {
            product = ProductResourceIT.createUpdatedEntity(em);
            em.persist(product);
            em.flush();
        } else {
            product = TestUtil.findAll(em, Product.class).get(0);
        }
        launch.setProduct(product);
        return launch;
    }

    @BeforeEach
    public void initTest() {
        launch = createEntity(em);
    }

    @Test
    @Transactional
    void createLaunch() throws Exception {
        int databaseSizeBeforeCreate = launchRepository.findAll().size();
        // Create the Launch
        restLaunchMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(launch)))
            .andExpect(status().isCreated());

        // Validate the Launch in the database
        List<Launch> launchList = launchRepository.findAll();
        assertThat(launchList).hasSize(databaseSizeBeforeCreate + 1);
        Launch testLaunch = launchList.get(launchList.size() - 1);
        assertThat(testLaunch.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testLaunch.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testLaunch.getStart()).isEqualTo(DEFAULT_START);
        assertThat(testLaunch.getVersion()).isEqualTo(DEFAULT_VERSION);
        assertThat(testLaunch.getIcon()).isEqualTo(DEFAULT_ICON);
        assertThat(testLaunch.getIconContentType()).isEqualTo(DEFAULT_ICON_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createLaunchWithExistingId() throws Exception {
        // Create the Launch with an existing ID
        launch.setId(1L);

        int databaseSizeBeforeCreate = launchRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLaunchMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(launch)))
            .andExpect(status().isBadRequest());

        // Validate the Launch in the database
        List<Launch> launchList = launchRepository.findAll();
        assertThat(launchList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = launchRepository.findAll().size();
        // set the field null
        launch.setName(null);

        // Create the Launch, which fails.

        restLaunchMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(launch)))
            .andExpect(status().isBadRequest());

        List<Launch> launchList = launchRepository.findAll();
        assertThat(launchList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllLaunches() throws Exception {
        // Initialize the database
        launchRepository.saveAndFlush(launch);

        // Get all the launchList
        restLaunchMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(launch.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].start").value(hasItem(sameInstant(DEFAULT_START))))
            .andExpect(jsonPath("$.[*].version").value(hasItem(DEFAULT_VERSION)))
            .andExpect(jsonPath("$.[*].iconContentType").value(hasItem(DEFAULT_ICON_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].icon").value(hasItem(Base64Utils.encodeToString(DEFAULT_ICON))));
    }

    @Test
    @Transactional
    void getLaunch() throws Exception {
        // Initialize the database
        launchRepository.saveAndFlush(launch);

        // Get the launch
        restLaunchMockMvc
            .perform(get(ENTITY_API_URL_ID, launch.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(launch.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.start").value(sameInstant(DEFAULT_START)))
            .andExpect(jsonPath("$.version").value(DEFAULT_VERSION))
            .andExpect(jsonPath("$.iconContentType").value(DEFAULT_ICON_CONTENT_TYPE))
            .andExpect(jsonPath("$.icon").value(Base64Utils.encodeToString(DEFAULT_ICON)));
    }

    @Test
    @Transactional
    void getNonExistingLaunch() throws Exception {
        // Get the launch
        restLaunchMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewLaunch() throws Exception {
        // Initialize the database
        launchRepository.saveAndFlush(launch);

        int databaseSizeBeforeUpdate = launchRepository.findAll().size();

        // Update the launch
        Launch updatedLaunch = launchRepository.findById(launch.getId()).get();
        // Disconnect from session so that the updates on updatedLaunch are not directly saved in db
        em.detach(updatedLaunch);
        updatedLaunch
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .start(UPDATED_START)
            .version(UPDATED_VERSION)
            .icon(UPDATED_ICON)
            .iconContentType(UPDATED_ICON_CONTENT_TYPE);

        restLaunchMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLaunch.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLaunch))
            )
            .andExpect(status().isOk());

        // Validate the Launch in the database
        List<Launch> launchList = launchRepository.findAll();
        assertThat(launchList).hasSize(databaseSizeBeforeUpdate);
        Launch testLaunch = launchList.get(launchList.size() - 1);
        assertThat(testLaunch.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testLaunch.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testLaunch.getStart()).isEqualTo(UPDATED_START);
        assertThat(testLaunch.getVersion()).isEqualTo(UPDATED_VERSION);
        assertThat(testLaunch.getIcon()).isEqualTo(UPDATED_ICON);
        assertThat(testLaunch.getIconContentType()).isEqualTo(UPDATED_ICON_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingLaunch() throws Exception {
        int databaseSizeBeforeUpdate = launchRepository.findAll().size();
        launch.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLaunchMockMvc
            .perform(
                put(ENTITY_API_URL_ID, launch.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(launch))
            )
            .andExpect(status().isBadRequest());

        // Validate the Launch in the database
        List<Launch> launchList = launchRepository.findAll();
        assertThat(launchList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLaunch() throws Exception {
        int databaseSizeBeforeUpdate = launchRepository.findAll().size();
        launch.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLaunchMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(launch))
            )
            .andExpect(status().isBadRequest());

        // Validate the Launch in the database
        List<Launch> launchList = launchRepository.findAll();
        assertThat(launchList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLaunch() throws Exception {
        int databaseSizeBeforeUpdate = launchRepository.findAll().size();
        launch.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLaunchMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(launch)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Launch in the database
        List<Launch> launchList = launchRepository.findAll();
        assertThat(launchList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLaunchWithPatch() throws Exception {
        // Initialize the database
        launchRepository.saveAndFlush(launch);

        int databaseSizeBeforeUpdate = launchRepository.findAll().size();

        // Update the launch using partial update
        Launch partialUpdatedLaunch = new Launch();
        partialUpdatedLaunch.setId(launch.getId());

        partialUpdatedLaunch
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .start(UPDATED_START)
            .icon(UPDATED_ICON)
            .iconContentType(UPDATED_ICON_CONTENT_TYPE);

        restLaunchMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLaunch.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLaunch))
            )
            .andExpect(status().isOk());

        // Validate the Launch in the database
        List<Launch> launchList = launchRepository.findAll();
        assertThat(launchList).hasSize(databaseSizeBeforeUpdate);
        Launch testLaunch = launchList.get(launchList.size() - 1);
        assertThat(testLaunch.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testLaunch.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testLaunch.getStart()).isEqualTo(UPDATED_START);
        assertThat(testLaunch.getVersion()).isEqualTo(DEFAULT_VERSION);
        assertThat(testLaunch.getIcon()).isEqualTo(UPDATED_ICON);
        assertThat(testLaunch.getIconContentType()).isEqualTo(UPDATED_ICON_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateLaunchWithPatch() throws Exception {
        // Initialize the database
        launchRepository.saveAndFlush(launch);

        int databaseSizeBeforeUpdate = launchRepository.findAll().size();

        // Update the launch using partial update
        Launch partialUpdatedLaunch = new Launch();
        partialUpdatedLaunch.setId(launch.getId());

        partialUpdatedLaunch
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .start(UPDATED_START)
            .version(UPDATED_VERSION)
            .icon(UPDATED_ICON)
            .iconContentType(UPDATED_ICON_CONTENT_TYPE);

        restLaunchMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLaunch.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLaunch))
            )
            .andExpect(status().isOk());

        // Validate the Launch in the database
        List<Launch> launchList = launchRepository.findAll();
        assertThat(launchList).hasSize(databaseSizeBeforeUpdate);
        Launch testLaunch = launchList.get(launchList.size() - 1);
        assertThat(testLaunch.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testLaunch.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testLaunch.getStart()).isEqualTo(UPDATED_START);
        assertThat(testLaunch.getVersion()).isEqualTo(UPDATED_VERSION);
        assertThat(testLaunch.getIcon()).isEqualTo(UPDATED_ICON);
        assertThat(testLaunch.getIconContentType()).isEqualTo(UPDATED_ICON_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingLaunch() throws Exception {
        int databaseSizeBeforeUpdate = launchRepository.findAll().size();
        launch.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLaunchMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, launch.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(launch))
            )
            .andExpect(status().isBadRequest());

        // Validate the Launch in the database
        List<Launch> launchList = launchRepository.findAll();
        assertThat(launchList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLaunch() throws Exception {
        int databaseSizeBeforeUpdate = launchRepository.findAll().size();
        launch.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLaunchMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(launch))
            )
            .andExpect(status().isBadRequest());

        // Validate the Launch in the database
        List<Launch> launchList = launchRepository.findAll();
        assertThat(launchList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLaunch() throws Exception {
        int databaseSizeBeforeUpdate = launchRepository.findAll().size();
        launch.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLaunchMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(launch)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Launch in the database
        List<Launch> launchList = launchRepository.findAll();
        assertThat(launchList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLaunch() throws Exception {
        // Initialize the database
        launchRepository.saveAndFlush(launch);

        int databaseSizeBeforeDelete = launchRepository.findAll().size();

        // Delete the launch
        restLaunchMockMvc
            .perform(delete(ENTITY_API_URL_ID, launch.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Launch> launchList = launchRepository.findAll();
        assertThat(launchList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
