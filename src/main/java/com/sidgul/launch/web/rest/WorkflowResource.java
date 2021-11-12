package com.sidgul.launch.web.rest;

import com.sidgul.launch.domain.Workflow;
import com.sidgul.launch.repository.WorkflowRepository;
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
 * REST controller for managing {@link com.sidgul.launch.domain.Workflow}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class WorkflowResource {

    private final Logger log = LoggerFactory.getLogger(WorkflowResource.class);

    private static final String ENTITY_NAME = "workflow";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WorkflowRepository workflowRepository;

    public WorkflowResource(WorkflowRepository workflowRepository) {
        this.workflowRepository = workflowRepository;
    }

    /**
     * {@code POST  /workflows} : Create a new workflow.
     *
     * @param workflow the workflow to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new workflow, or with status {@code 400 (Bad Request)} if the workflow has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/workflows")
    public ResponseEntity<Workflow> createWorkflow(@Valid @RequestBody Workflow workflow) throws URISyntaxException {
        log.debug("REST request to save Workflow : {}", workflow);
        if (workflow.getId() != null) {
            throw new BadRequestAlertException("A new workflow cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Workflow result = workflowRepository.save(workflow);
        return ResponseEntity
            .created(new URI("/api/workflows/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /workflows/:id} : Updates an existing workflow.
     *
     * @param id the id of the workflow to save.
     * @param workflow the workflow to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated workflow,
     * or with status {@code 400 (Bad Request)} if the workflow is not valid,
     * or with status {@code 500 (Internal Server Error)} if the workflow couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/workflows/{id}")
    public ResponseEntity<Workflow> updateWorkflow(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Workflow workflow
    ) throws URISyntaxException {
        log.debug("REST request to update Workflow : {}, {}", id, workflow);
        if (workflow.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, workflow.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!workflowRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Workflow result = workflowRepository.save(workflow);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, workflow.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /workflows/:id} : Partial updates given fields of an existing workflow, field will ignore if it is null
     *
     * @param id the id of the workflow to save.
     * @param workflow the workflow to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated workflow,
     * or with status {@code 400 (Bad Request)} if the workflow is not valid,
     * or with status {@code 404 (Not Found)} if the workflow is not found,
     * or with status {@code 500 (Internal Server Error)} if the workflow couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/workflows/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Workflow> partialUpdateWorkflow(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Workflow workflow
    ) throws URISyntaxException {
        log.debug("REST request to partial update Workflow partially : {}, {}", id, workflow);
        if (workflow.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, workflow.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!workflowRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Workflow> result = workflowRepository
            .findById(workflow.getId())
            .map(existingWorkflow -> {
                if (workflow.getName() != null) {
                    existingWorkflow.setName(workflow.getName());
                }
                if (workflow.getDescription() != null) {
                    existingWorkflow.setDescription(workflow.getDescription());
                }

                return existingWorkflow;
            })
            .map(workflowRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, workflow.getId().toString())
        );
    }

    /**
     * {@code GET  /workflows} : get all the workflows.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of workflows in body.
     */
    @GetMapping("/workflows")
    public List<Workflow> getAllWorkflows() {
        log.debug("REST request to get all Workflows");
        return workflowRepository.findAll();
    }

    /**
     * {@code GET  /workflows/:id} : get the "id" workflow.
     *
     * @param id the id of the workflow to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the workflow, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/workflows/{id}")
    public ResponseEntity<Workflow> getWorkflow(@PathVariable Long id) {
        log.debug("REST request to get Workflow : {}", id);
        Optional<Workflow> workflow = workflowRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(workflow);
    }

    /**
     * {@code DELETE  /workflows/:id} : delete the "id" workflow.
     *
     * @param id the id of the workflow to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/workflows/{id}")
    public ResponseEntity<Void> deleteWorkflow(@PathVariable Long id) {
        log.debug("REST request to delete Workflow : {}", id);
        workflowRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
