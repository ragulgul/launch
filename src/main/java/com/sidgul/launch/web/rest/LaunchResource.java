package com.sidgul.launch.web.rest;

import com.sidgul.launch.domain.Launch;
import com.sidgul.launch.repository.LaunchRepository;
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
 * REST controller for managing {@link com.sidgul.launch.domain.Launch}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LaunchResource {

    private final Logger log = LoggerFactory.getLogger(LaunchResource.class);

    private static final String ENTITY_NAME = "launch";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LaunchRepository launchRepository;

    public LaunchResource(LaunchRepository launchRepository) {
        this.launchRepository = launchRepository;
    }

    /**
     * {@code POST  /launches} : Create a new launch.
     *
     * @param launch the launch to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new launch, or with status {@code 400 (Bad Request)} if the launch has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/launches")
    public ResponseEntity<Launch> createLaunch(@Valid @RequestBody Launch launch) throws URISyntaxException {
        log.debug("REST request to save Launch : {}", launch);
        if (launch.getId() != null) {
            throw new BadRequestAlertException("A new launch cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Launch result = launchRepository.save(launch);
        return ResponseEntity
            .created(new URI("/api/launches/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /launches/:id} : Updates an existing launch.
     *
     * @param id the id of the launch to save.
     * @param launch the launch to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated launch,
     * or with status {@code 400 (Bad Request)} if the launch is not valid,
     * or with status {@code 500 (Internal Server Error)} if the launch couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/launches/{id}")
    public ResponseEntity<Launch> updateLaunch(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Launch launch
    ) throws URISyntaxException {
        log.debug("REST request to update Launch : {}, {}", id, launch);
        if (launch.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, launch.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!launchRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Launch result = launchRepository.save(launch);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, launch.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /launches/:id} : Partial updates given fields of an existing launch, field will ignore if it is null
     *
     * @param id the id of the launch to save.
     * @param launch the launch to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated launch,
     * or with status {@code 400 (Bad Request)} if the launch is not valid,
     * or with status {@code 404 (Not Found)} if the launch is not found,
     * or with status {@code 500 (Internal Server Error)} if the launch couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/launches/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Launch> partialUpdateLaunch(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Launch launch
    ) throws URISyntaxException {
        log.debug("REST request to partial update Launch partially : {}, {}", id, launch);
        if (launch.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, launch.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!launchRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Launch> result = launchRepository
            .findById(launch.getId())
            .map(existingLaunch -> {
                if (launch.getName() != null) {
                    existingLaunch.setName(launch.getName());
                }
                if (launch.getDescription() != null) {
                    existingLaunch.setDescription(launch.getDescription());
                }
                if (launch.getStart() != null) {
                    existingLaunch.setStart(launch.getStart());
                }
                if (launch.getVersion() != null) {
                    existingLaunch.setVersion(launch.getVersion());
                }
                if (launch.getIcon() != null) {
                    existingLaunch.setIcon(launch.getIcon());
                }
                if (launch.getIconContentType() != null) {
                    existingLaunch.setIconContentType(launch.getIconContentType());
                }

                return existingLaunch;
            })
            .map(launchRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, launch.getId().toString())
        );
    }

    /**
     * {@code GET  /launches} : get all the launches.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of launches in body.
     */
    @GetMapping("/launches")
    public List<Launch> getAllLaunches() {
        log.debug("REST request to get all Launches");
        return launchRepository.findAll();
    }

    /**
     * {@code GET  /launches/:id} : get the "id" launch.
     *
     * @param id the id of the launch to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the launch, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/launches/{id}")
    public ResponseEntity<Launch> getLaunch(@PathVariable Long id) {
        log.debug("REST request to get Launch : {}", id);
        Optional<Launch> launch = launchRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(launch);
    }

    /**
     * {@code DELETE  /launches/:id} : delete the "id" launch.
     *
     * @param id the id of the launch to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/launches/{id}")
    public ResponseEntity<Void> deleteLaunch(@PathVariable Long id) {
        log.debug("REST request to delete Launch : {}", id);
        launchRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
