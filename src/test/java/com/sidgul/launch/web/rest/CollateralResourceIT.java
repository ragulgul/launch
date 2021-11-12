package com.sidgul.launch.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.sidgul.launch.IntegrationTest;
import com.sidgul.launch.domain.Collateral;
import com.sidgul.launch.domain.Launch;
import com.sidgul.launch.repository.CollateralRepository;
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
 * Integration tests for the {@link CollateralResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CollateralResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final byte[] DEFAULT_ICON = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_ICON = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_ICON_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_ICON_CONTENT_TYPE = "image/png";

    private static final byte[] DEFAULT_CONTENT = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_CONTENT = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_CONTENT_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_CONTENT_CONTENT_TYPE = "image/png";

    private static final Integer DEFAULT_VERSION = 1;
    private static final Integer UPDATED_VERSION = 2;

    private static final String ENTITY_API_URL = "/api/collaterals";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CollateralRepository collateralRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCollateralMockMvc;

    private Collateral collateral;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Collateral createEntity(EntityManager em) {
        Collateral collateral = new Collateral()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .icon(DEFAULT_ICON)
            .iconContentType(DEFAULT_ICON_CONTENT_TYPE)
            .content(DEFAULT_CONTENT)
            .contentContentType(DEFAULT_CONTENT_CONTENT_TYPE)
            .version(DEFAULT_VERSION);
        // Add required entity
        Launch launch;
        if (TestUtil.findAll(em, Launch.class).isEmpty()) {
            launch = LaunchResourceIT.createEntity(em);
            em.persist(launch);
            em.flush();
        } else {
            launch = TestUtil.findAll(em, Launch.class).get(0);
        }
        collateral.setLaunch(launch);
        return collateral;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Collateral createUpdatedEntity(EntityManager em) {
        Collateral collateral = new Collateral()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .icon(UPDATED_ICON)
            .iconContentType(UPDATED_ICON_CONTENT_TYPE)
            .content(UPDATED_CONTENT)
            .contentContentType(UPDATED_CONTENT_CONTENT_TYPE)
            .version(UPDATED_VERSION);
        // Add required entity
        Launch launch;
        if (TestUtil.findAll(em, Launch.class).isEmpty()) {
            launch = LaunchResourceIT.createUpdatedEntity(em);
            em.persist(launch);
            em.flush();
        } else {
            launch = TestUtil.findAll(em, Launch.class).get(0);
        }
        collateral.setLaunch(launch);
        return collateral;
    }

    @BeforeEach
    public void initTest() {
        collateral = createEntity(em);
    }

    @Test
    @Transactional
    void createCollateral() throws Exception {
        int databaseSizeBeforeCreate = collateralRepository.findAll().size();
        // Create the Collateral
        restCollateralMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(collateral)))
            .andExpect(status().isCreated());

        // Validate the Collateral in the database
        List<Collateral> collateralList = collateralRepository.findAll();
        assertThat(collateralList).hasSize(databaseSizeBeforeCreate + 1);
        Collateral testCollateral = collateralList.get(collateralList.size() - 1);
        assertThat(testCollateral.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCollateral.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testCollateral.getIcon()).isEqualTo(DEFAULT_ICON);
        assertThat(testCollateral.getIconContentType()).isEqualTo(DEFAULT_ICON_CONTENT_TYPE);
        assertThat(testCollateral.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testCollateral.getContentContentType()).isEqualTo(DEFAULT_CONTENT_CONTENT_TYPE);
        assertThat(testCollateral.getVersion()).isEqualTo(DEFAULT_VERSION);
    }

    @Test
    @Transactional
    void createCollateralWithExistingId() throws Exception {
        // Create the Collateral with an existing ID
        collateral.setId(1L);

        int databaseSizeBeforeCreate = collateralRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCollateralMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(collateral)))
            .andExpect(status().isBadRequest());

        // Validate the Collateral in the database
        List<Collateral> collateralList = collateralRepository.findAll();
        assertThat(collateralList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = collateralRepository.findAll().size();
        // set the field null
        collateral.setName(null);

        // Create the Collateral, which fails.

        restCollateralMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(collateral)))
            .andExpect(status().isBadRequest());

        List<Collateral> collateralList = collateralRepository.findAll();
        assertThat(collateralList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCollaterals() throws Exception {
        // Initialize the database
        collateralRepository.saveAndFlush(collateral);

        // Get all the collateralList
        restCollateralMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(collateral.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].iconContentType").value(hasItem(DEFAULT_ICON_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].icon").value(hasItem(Base64Utils.encodeToString(DEFAULT_ICON))))
            .andExpect(jsonPath("$.[*].contentContentType").value(hasItem(DEFAULT_CONTENT_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].content").value(hasItem(Base64Utils.encodeToString(DEFAULT_CONTENT))))
            .andExpect(jsonPath("$.[*].version").value(hasItem(DEFAULT_VERSION)));
    }

    @Test
    @Transactional
    void getCollateral() throws Exception {
        // Initialize the database
        collateralRepository.saveAndFlush(collateral);

        // Get the collateral
        restCollateralMockMvc
            .perform(get(ENTITY_API_URL_ID, collateral.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(collateral.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.iconContentType").value(DEFAULT_ICON_CONTENT_TYPE))
            .andExpect(jsonPath("$.icon").value(Base64Utils.encodeToString(DEFAULT_ICON)))
            .andExpect(jsonPath("$.contentContentType").value(DEFAULT_CONTENT_CONTENT_TYPE))
            .andExpect(jsonPath("$.content").value(Base64Utils.encodeToString(DEFAULT_CONTENT)))
            .andExpect(jsonPath("$.version").value(DEFAULT_VERSION));
    }

    @Test
    @Transactional
    void getNonExistingCollateral() throws Exception {
        // Get the collateral
        restCollateralMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCollateral() throws Exception {
        // Initialize the database
        collateralRepository.saveAndFlush(collateral);

        int databaseSizeBeforeUpdate = collateralRepository.findAll().size();

        // Update the collateral
        Collateral updatedCollateral = collateralRepository.findById(collateral.getId()).get();
        // Disconnect from session so that the updates on updatedCollateral are not directly saved in db
        em.detach(updatedCollateral);
        updatedCollateral
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .icon(UPDATED_ICON)
            .iconContentType(UPDATED_ICON_CONTENT_TYPE)
            .content(UPDATED_CONTENT)
            .contentContentType(UPDATED_CONTENT_CONTENT_TYPE)
            .version(UPDATED_VERSION);

        restCollateralMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCollateral.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCollateral))
            )
            .andExpect(status().isOk());

        // Validate the Collateral in the database
        List<Collateral> collateralList = collateralRepository.findAll();
        assertThat(collateralList).hasSize(databaseSizeBeforeUpdate);
        Collateral testCollateral = collateralList.get(collateralList.size() - 1);
        assertThat(testCollateral.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCollateral.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCollateral.getIcon()).isEqualTo(UPDATED_ICON);
        assertThat(testCollateral.getIconContentType()).isEqualTo(UPDATED_ICON_CONTENT_TYPE);
        assertThat(testCollateral.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testCollateral.getContentContentType()).isEqualTo(UPDATED_CONTENT_CONTENT_TYPE);
        assertThat(testCollateral.getVersion()).isEqualTo(UPDATED_VERSION);
    }

    @Test
    @Transactional
    void putNonExistingCollateral() throws Exception {
        int databaseSizeBeforeUpdate = collateralRepository.findAll().size();
        collateral.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCollateralMockMvc
            .perform(
                put(ENTITY_API_URL_ID, collateral.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(collateral))
            )
            .andExpect(status().isBadRequest());

        // Validate the Collateral in the database
        List<Collateral> collateralList = collateralRepository.findAll();
        assertThat(collateralList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCollateral() throws Exception {
        int databaseSizeBeforeUpdate = collateralRepository.findAll().size();
        collateral.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCollateralMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(collateral))
            )
            .andExpect(status().isBadRequest());

        // Validate the Collateral in the database
        List<Collateral> collateralList = collateralRepository.findAll();
        assertThat(collateralList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCollateral() throws Exception {
        int databaseSizeBeforeUpdate = collateralRepository.findAll().size();
        collateral.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCollateralMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(collateral)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Collateral in the database
        List<Collateral> collateralList = collateralRepository.findAll();
        assertThat(collateralList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCollateralWithPatch() throws Exception {
        // Initialize the database
        collateralRepository.saveAndFlush(collateral);

        int databaseSizeBeforeUpdate = collateralRepository.findAll().size();

        // Update the collateral using partial update
        Collateral partialUpdatedCollateral = new Collateral();
        partialUpdatedCollateral.setId(collateral.getId());

        partialUpdatedCollateral.name(UPDATED_NAME).icon(UPDATED_ICON).iconContentType(UPDATED_ICON_CONTENT_TYPE);

        restCollateralMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCollateral.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCollateral))
            )
            .andExpect(status().isOk());

        // Validate the Collateral in the database
        List<Collateral> collateralList = collateralRepository.findAll();
        assertThat(collateralList).hasSize(databaseSizeBeforeUpdate);
        Collateral testCollateral = collateralList.get(collateralList.size() - 1);
        assertThat(testCollateral.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCollateral.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testCollateral.getIcon()).isEqualTo(UPDATED_ICON);
        assertThat(testCollateral.getIconContentType()).isEqualTo(UPDATED_ICON_CONTENT_TYPE);
        assertThat(testCollateral.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testCollateral.getContentContentType()).isEqualTo(DEFAULT_CONTENT_CONTENT_TYPE);
        assertThat(testCollateral.getVersion()).isEqualTo(DEFAULT_VERSION);
    }

    @Test
    @Transactional
    void fullUpdateCollateralWithPatch() throws Exception {
        // Initialize the database
        collateralRepository.saveAndFlush(collateral);

        int databaseSizeBeforeUpdate = collateralRepository.findAll().size();

        // Update the collateral using partial update
        Collateral partialUpdatedCollateral = new Collateral();
        partialUpdatedCollateral.setId(collateral.getId());

        partialUpdatedCollateral
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .icon(UPDATED_ICON)
            .iconContentType(UPDATED_ICON_CONTENT_TYPE)
            .content(UPDATED_CONTENT)
            .contentContentType(UPDATED_CONTENT_CONTENT_TYPE)
            .version(UPDATED_VERSION);

        restCollateralMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCollateral.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCollateral))
            )
            .andExpect(status().isOk());

        // Validate the Collateral in the database
        List<Collateral> collateralList = collateralRepository.findAll();
        assertThat(collateralList).hasSize(databaseSizeBeforeUpdate);
        Collateral testCollateral = collateralList.get(collateralList.size() - 1);
        assertThat(testCollateral.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCollateral.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCollateral.getIcon()).isEqualTo(UPDATED_ICON);
        assertThat(testCollateral.getIconContentType()).isEqualTo(UPDATED_ICON_CONTENT_TYPE);
        assertThat(testCollateral.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testCollateral.getContentContentType()).isEqualTo(UPDATED_CONTENT_CONTENT_TYPE);
        assertThat(testCollateral.getVersion()).isEqualTo(UPDATED_VERSION);
    }

    @Test
    @Transactional
    void patchNonExistingCollateral() throws Exception {
        int databaseSizeBeforeUpdate = collateralRepository.findAll().size();
        collateral.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCollateralMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, collateral.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(collateral))
            )
            .andExpect(status().isBadRequest());

        // Validate the Collateral in the database
        List<Collateral> collateralList = collateralRepository.findAll();
        assertThat(collateralList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCollateral() throws Exception {
        int databaseSizeBeforeUpdate = collateralRepository.findAll().size();
        collateral.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCollateralMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(collateral))
            )
            .andExpect(status().isBadRequest());

        // Validate the Collateral in the database
        List<Collateral> collateralList = collateralRepository.findAll();
        assertThat(collateralList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCollateral() throws Exception {
        int databaseSizeBeforeUpdate = collateralRepository.findAll().size();
        collateral.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCollateralMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(collateral))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Collateral in the database
        List<Collateral> collateralList = collateralRepository.findAll();
        assertThat(collateralList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCollateral() throws Exception {
        // Initialize the database
        collateralRepository.saveAndFlush(collateral);

        int databaseSizeBeforeDelete = collateralRepository.findAll().size();

        // Delete the collateral
        restCollateralMockMvc
            .perform(delete(ENTITY_API_URL_ID, collateral.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Collateral> collateralList = collateralRepository.findAll();
        assertThat(collateralList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
