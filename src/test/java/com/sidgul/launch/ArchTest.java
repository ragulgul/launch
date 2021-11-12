package com.sidgul.launch;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {
        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("com.sidgul.launch");

        noClasses()
            .that()
            .resideInAnyPackage("com.sidgul.launch.service..")
            .or()
            .resideInAnyPackage("com.sidgul.launch.repository..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage("..com.sidgul.launch.web..")
            .because("Services and repositories should not depend on web layer")
            .check(importedClasses);
    }
}
