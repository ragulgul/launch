package com.sidgul.launch.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.sidgul.launch.IntegrationTest;
import com.sidgul.launch.domain.ProductLine;
import com.sidgul.launch.repository.ProductLineRepository;
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
 * Integration tests for the {@link ProductLineResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProductLineResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final byte[] DEFAULT_ICON = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_ICON = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_ICON_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_ICON_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/product-lines";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProductLineRepository productLineRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProductLineMockMvc;

    private ProductLine productLine;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductLine createEntity(EntityManager em) {
        ProductLine productLine = new ProductLine()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .icon(DEFAULT_ICON)
            .iconContentType(DEFAULT_ICON_CONTENT_TYPE);
        return productLine;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductLine createUpdatedEntity(EntityManager em) {
        ProductLine productLine = new ProductLine()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .icon(UPDATED_ICON)
            .iconContentType(UPDATED_ICON_CONTENT_TYPE);
        return productLine;
    }

    @BeforeEach
    public void initTest() {
        productLine = createEntity(em);
    }

    @Test
    @Transactional
    void createProductLine() throws Exception {
        int databaseSizeBeforeCreate = productLineRepository.findAll().size();
        // Create the ProductLine
        restProductLineMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productLine)))
            .andExpect(status().isCreated());

        // Validate the ProductLine in the database
        List<ProductLine> productLineList = productLineRepository.findAll();
        assertThat(productLineList).hasSize(databaseSizeBeforeCreate + 1);
        ProductLine testProductLine = productLineList.get(productLineList.size() - 1);
        assertThat(testProductLine.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testProductLine.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testProductLine.getIcon()).isEqualTo(DEFAULT_ICON);
        assertThat(testProductLine.getIconContentType()).isEqualTo(DEFAULT_ICON_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createProductLineWithExistingId() throws Exception {
        // Create the ProductLine with an existing ID
        productLine.setId(1L);

        int databaseSizeBeforeCreate = productLineRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductLineMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productLine)))
            .andExpect(status().isBadRequest());

        // Validate the ProductLine in the database
        List<ProductLine> productLineList = productLineRepository.findAll();
        assertThat(productLineList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = productLineRepository.findAll().size();
        // set the field null
        productLine.setName(null);

        // Create the ProductLine, which fails.

        restProductLineMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productLine)))
            .andExpect(status().isBadRequest());

        List<ProductLine> productLineList = productLineRepository.findAll();
        assertThat(productLineList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllProductLines() throws Exception {
        // Initialize the database
        productLineRepository.saveAndFlush(productLine);

        // Get all the productLineList
        restProductLineMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productLine.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].iconContentType").value(hasItem(DEFAULT_ICON_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].icon").value(hasItem(Base64Utils.encodeToString(DEFAULT_ICON))));
    }

    @Test
    @Transactional
    void getProductLine() throws Exception {
        // Initialize the database
        productLineRepository.saveAndFlush(productLine);

        // Get the productLine
        restProductLineMockMvc
            .perform(get(ENTITY_API_URL_ID, productLine.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(productLine.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.iconContentType").value(DEFAULT_ICON_CONTENT_TYPE))
            .andExpect(jsonPath("$.icon").value(Base64Utils.encodeToString(DEFAULT_ICON)));
    }

    @Test
    @Transactional
    void getNonExistingProductLine() throws Exception {
        // Get the productLine
        restProductLineMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewProductLine() throws Exception {
        // Initialize the database
        productLineRepository.saveAndFlush(productLine);

        int databaseSizeBeforeUpdate = productLineRepository.findAll().size();

        // Update the productLine
        ProductLine updatedProductLine = productLineRepository.findById(productLine.getId()).get();
        // Disconnect from session so that the updates on updatedProductLine are not directly saved in db
        em.detach(updatedProductLine);
        updatedProductLine
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .icon(UPDATED_ICON)
            .iconContentType(UPDATED_ICON_CONTENT_TYPE);

        restProductLineMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProductLine.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProductLine))
            )
            .andExpect(status().isOk());

        // Validate the ProductLine in the database
        List<ProductLine> productLineList = productLineRepository.findAll();
        assertThat(productLineList).hasSize(databaseSizeBeforeUpdate);
        ProductLine testProductLine = productLineList.get(productLineList.size() - 1);
        assertThat(testProductLine.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProductLine.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testProductLine.getIcon()).isEqualTo(UPDATED_ICON);
        assertThat(testProductLine.getIconContentType()).isEqualTo(UPDATED_ICON_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingProductLine() throws Exception {
        int databaseSizeBeforeUpdate = productLineRepository.findAll().size();
        productLine.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductLineMockMvc
            .perform(
                put(ENTITY_API_URL_ID, productLine.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productLine))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductLine in the database
        List<ProductLine> productLineList = productLineRepository.findAll();
        assertThat(productLineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProductLine() throws Exception {
        int databaseSizeBeforeUpdate = productLineRepository.findAll().size();
        productLine.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductLineMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productLine))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductLine in the database
        List<ProductLine> productLineList = productLineRepository.findAll();
        assertThat(productLineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProductLine() throws Exception {
        int databaseSizeBeforeUpdate = productLineRepository.findAll().size();
        productLine.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductLineMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productLine)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductLine in the database
        List<ProductLine> productLineList = productLineRepository.findAll();
        assertThat(productLineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProductLineWithPatch() throws Exception {
        // Initialize the database
        productLineRepository.saveAndFlush(productLine);

        int databaseSizeBeforeUpdate = productLineRepository.findAll().size();

        // Update the productLine using partial update
        ProductLine partialUpdatedProductLine = new ProductLine();
        partialUpdatedProductLine.setId(productLine.getId());

        partialUpdatedProductLine.name(UPDATED_NAME);

        restProductLineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductLine.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProductLine))
            )
            .andExpect(status().isOk());

        // Validate the ProductLine in the database
        List<ProductLine> productLineList = productLineRepository.findAll();
        assertThat(productLineList).hasSize(databaseSizeBeforeUpdate);
        ProductLine testProductLine = productLineList.get(productLineList.size() - 1);
        assertThat(testProductLine.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProductLine.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testProductLine.getIcon()).isEqualTo(DEFAULT_ICON);
        assertThat(testProductLine.getIconContentType()).isEqualTo(DEFAULT_ICON_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateProductLineWithPatch() throws Exception {
        // Initialize the database
        productLineRepository.saveAndFlush(productLine);

        int databaseSizeBeforeUpdate = productLineRepository.findAll().size();

        // Update the productLine using partial update
        ProductLine partialUpdatedProductLine = new ProductLine();
        partialUpdatedProductLine.setId(productLine.getId());

        partialUpdatedProductLine
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .icon(UPDATED_ICON)
            .iconContentType(UPDATED_ICON_CONTENT_TYPE);

        restProductLineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductLine.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProductLine))
            )
            .andExpect(status().isOk());

        // Validate the ProductLine in the database
        List<ProductLine> productLineList = productLineRepository.findAll();
        assertThat(productLineList).hasSize(databaseSizeBeforeUpdate);
        ProductLine testProductLine = productLineList.get(productLineList.size() - 1);
        assertThat(testProductLine.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProductLine.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testProductLine.getIcon()).isEqualTo(UPDATED_ICON);
        assertThat(testProductLine.getIconContentType()).isEqualTo(UPDATED_ICON_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingProductLine() throws Exception {
        int databaseSizeBeforeUpdate = productLineRepository.findAll().size();
        productLine.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductLineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, productLine.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productLine))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductLine in the database
        List<ProductLine> productLineList = productLineRepository.findAll();
        assertThat(productLineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProductLine() throws Exception {
        int databaseSizeBeforeUpdate = productLineRepository.findAll().size();
        productLine.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductLineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productLine))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductLine in the database
        List<ProductLine> productLineList = productLineRepository.findAll();
        assertThat(productLineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProductLine() throws Exception {
        int databaseSizeBeforeUpdate = productLineRepository.findAll().size();
        productLine.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductLineMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(productLine))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductLine in the database
        List<ProductLine> productLineList = productLineRepository.findAll();
        assertThat(productLineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProductLine() throws Exception {
        // Initialize the database
        productLineRepository.saveAndFlush(productLine);

        int databaseSizeBeforeDelete = productLineRepository.findAll().size();

        // Delete the productLine
        restProductLineMockMvc
            .perform(delete(ENTITY_API_URL_ID, productLine.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProductLine> productLineList = productLineRepository.findAll();
        assertThat(productLineList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
