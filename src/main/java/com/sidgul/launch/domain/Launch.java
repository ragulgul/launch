package com.sidgul.launch.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Launch.
 */
@Entity
@Table(name = "launch")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Launch implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "start")
    private ZonedDateTime start;

    @Column(name = "version")
    private Integer version;

    @Lob
    @Column(name = "icon")
    private byte[] icon;

    @Column(name = "icon_content_type")
    private String iconContentType;

    @JsonIgnoreProperties(value = { "tasks" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Workflow workflow;

    @OneToMany(mappedBy = "launch")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "workflow", "launch" }, allowSetters = true)
    private Set<Collateral> collaterals = new HashSet<>();

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "line" }, allowSetters = true)
    private Product product;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Launch id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Launch name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Launch description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ZonedDateTime getStart() {
        return this.start;
    }

    public Launch start(ZonedDateTime start) {
        this.setStart(start);
        return this;
    }

    public void setStart(ZonedDateTime start) {
        this.start = start;
    }

    public Integer getVersion() {
        return this.version;
    }

    public Launch version(Integer version) {
        this.setVersion(version);
        return this;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public byte[] getIcon() {
        return this.icon;
    }

    public Launch icon(byte[] icon) {
        this.setIcon(icon);
        return this;
    }

    public void setIcon(byte[] icon) {
        this.icon = icon;
    }

    public String getIconContentType() {
        return this.iconContentType;
    }

    public Launch iconContentType(String iconContentType) {
        this.iconContentType = iconContentType;
        return this;
    }

    public void setIconContentType(String iconContentType) {
        this.iconContentType = iconContentType;
    }

    public Workflow getWorkflow() {
        return this.workflow;
    }

    public void setWorkflow(Workflow workflow) {
        this.workflow = workflow;
    }

    public Launch workflow(Workflow workflow) {
        this.setWorkflow(workflow);
        return this;
    }

    public Set<Collateral> getCollaterals() {
        return this.collaterals;
    }

    public void setCollaterals(Set<Collateral> collaterals) {
        if (this.collaterals != null) {
            this.collaterals.forEach(i -> i.setLaunch(null));
        }
        if (collaterals != null) {
            collaterals.forEach(i -> i.setLaunch(this));
        }
        this.collaterals = collaterals;
    }

    public Launch collaterals(Set<Collateral> collaterals) {
        this.setCollaterals(collaterals);
        return this;
    }

    public Launch addCollaterals(Collateral collateral) {
        this.collaterals.add(collateral);
        collateral.setLaunch(this);
        return this;
    }

    public Launch removeCollaterals(Collateral collateral) {
        this.collaterals.remove(collateral);
        collateral.setLaunch(null);
        return this;
    }

    public Product getProduct() {
        return this.product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Launch product(Product product) {
        this.setProduct(product);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Launch)) {
            return false;
        }
        return id != null && id.equals(((Launch) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Launch{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", start='" + getStart() + "'" +
            ", version=" + getVersion() +
            ", icon='" + getIcon() + "'" +
            ", iconContentType='" + getIconContentType() + "'" +
            "}";
    }
}
