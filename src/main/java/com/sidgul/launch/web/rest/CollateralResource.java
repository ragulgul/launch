package com.sidgul.launch.web.rest;

import com.sidgul.launch.domain.Collateral;
import com.sidgul.launch.repository.CollateralRepository;
import com.sidgul.launch.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.sidgul.launch.domain.Collateral}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CollateralResource {

    private final Logger log = LoggerFactory.getLogger(CollateralResource.class);

    private static final String ENTITY_NAME = "collateral";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CollateralRepository collateralRepository;

    public CollateralResource(CollateralRepository collateralRepository) {
        this.collateralRepository = collateralRepository;
    }

    /**
     * {@code POST  /collaterals} : Create a new collateral.
     *
     * @param collateral the collateral to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new collateral, or with status {@code 400 (Bad Request)} if the collateral has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/collaterals")
    public ResponseEntity<Collateral> createCollateral(@Valid @RequestBody Collateral collateral) throws URISyntaxException {
        log.debug("REST request to save Collateral : {}", collateral);
        if (collateral.getId() != null) {
            throw new BadRequestAlertException("A new collateral cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Collateral result = collateralRepository.save(collateral);
        return ResponseEntity
            .created(new URI("/api/collaterals/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /collaterals/:id} : Updates an existing collateral.
     *
     * @param id the id of the collateral to save.
     * @param collateral the collateral to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated collateral,
     * or with status {@code 400 (Bad Request)} if the collateral is not valid,
     * or with status {@code 500 (Internal Server Error)} if the collateral couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/collaterals/{id}")
    public ResponseEntity<Collateral> updateCollateral(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Collateral collateral
    ) throws URISyntaxException {
        log.debug("REST request to update Collateral : {}, {}", id, collateral);
        if (collateral.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, collateral.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!collateralRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Collateral result = collateralRepository.save(collateral);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, collateral.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /collaterals/:id} : Partial updates given fields of an existing collateral, field will ignore if it is null
     *
     * @param id the id of the collateral to save.
     * @param collateral the collateral to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated collateral,
     * or with status {@code 400 (Bad Request)} if the collateral is not valid,
     * or with status {@code 404 (Not Found)} if the collateral is not found,
     * or with status {@code 500 (Internal Server Error)} if the collateral couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/collaterals/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Collateral> partialUpdateCollateral(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Collateral collateral
    ) throws URISyntaxException {
        log.debug("REST request to partial update Collateral partially : {}, {}", id, collateral);
        if (collateral.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, collateral.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!collateralRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Collateral> result = collateralRepository
            .findById(collateral.getId())
            .map(existingCollateral -> {
                if (collateral.getName() != null) {
                    existingCollateral.setName(collateral.getName());
                }
                if (collateral.getDescription() != null) {
                    existingCollateral.setDescription(collateral.getDescription());
                }
                if (collateral.getIcon() != null) {
                    existingCollateral.setIcon(collateral.getIcon());
                }
                if (collateral.getIconContentType() != null) {
                    existingCollateral.setIconContentType(collateral.getIconContentType());
                }
                if (collateral.getContent() != null) {
                    existingCollateral.setContent(collateral.getContent());
                }
                if (collateral.getContentContentType() != null) {
                    existingCollateral.setContentContentType(collateral.getContentContentType());
                }
                if (collateral.getVersion() != null) {
                    existingCollateral.setVersion(collateral.getVersion());
                }

                return existingCollateral;
            })
            .map(collateralRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, collateral.getId().toString())
        );
    }

    /**
     * {@code GET  /collaterals} : get all the collaterals.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of collaterals in body.
     */
    @GetMapping("/collaterals")
    public List<Collateral> getAllCollaterals() {
        log.debug("REST request to get all Collaterals");
        return collateralRepository.findAll();
    }

    /**
     * {@code GET  /collaterals/:id} : get the "id" collateral.
     *
     * @param id the id of the collateral to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the collateral, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/collaterals/{id}")
    public ResponseEntity<Collateral> getCollateral(@PathVariable Long id) {
        log.debug("REST request to get Collateral : {}", id);
        Optional<Collateral> collateral = collateralRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(collateral);
    }

    /**
     * {@code DELETE  /collaterals/:id} : delete the "id" collateral.
     *
     * @param id the id of the collateral to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/collaterals/{id}")
    public ResponseEntity<Void> deleteCollateral(@PathVariable Long id) {
        log.debug("REST request to delete Collateral : {}", id);
        collateralRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
