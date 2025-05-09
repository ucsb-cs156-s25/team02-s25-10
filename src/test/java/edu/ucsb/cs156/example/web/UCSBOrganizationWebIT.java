package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.AriaRole;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBOrganizationWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_ucsborganizations() throws Exception {
        setupUser(true);

        page.getByText("UCSB Organizations").click();
        page.waitForURL("**/ucsborganizations");
        page.getByText("Create Organization").click();
        assertThat(page.getByText("Create New UCSB Organization")).isVisible();
        page.getByLabel("OrgCode").fill("ZPR");
        page.getByLabel("OrgTranslationShort").fill("zeta phi rho");
        page.getByTestId("UCSBOrganizationForm-orgTranslation").fill("zeta phi rho fraternity");
        page.getByLabel("Inactive").selectOption("false");
        page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Create")).click();

        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgTranslation"))
                .hasText("zeta phi rho fraternity");

        page.getByTestId("UCSBOrganizationTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit Organization")).isVisible();
        page.getByLabel("Inactive").selectOption("true");
        page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Update")).click();

        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-inactive")).hasText("true");

        page.getByTestId("UCSBOrganizationTable-cell-row-0-col-Delete-button").click();
        
        try {
            page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Delete")).click();
        } catch (Exception e) {
        }
        
        page.waitForTimeout(2000);
        page.reload();
        
        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgCode")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_ucsborganizations() throws Exception {
        setupUser(false);

        page.getByText("UCSB Organizations").click();

        assertThat(page.getByText("Create ucsborganizations")).not().isVisible();
        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgCode")).not().isVisible();
    }

}