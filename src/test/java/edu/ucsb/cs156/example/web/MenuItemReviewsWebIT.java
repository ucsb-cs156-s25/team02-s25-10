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

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class MenuItemReviewsWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_review() throws Exception {
        setupUser(true);

        page.getByText("Menu Item Reviews").click();

        page.getByText("Create Review").click();
        assertThat(page.getByText("Create New Review")).isVisible();
        page.getByLabel("Item Id").fill("2");
        page.getByLabel("Reviewer Email").fill("johnsmith@gmail.com");
        page.getByLabel("Stars").fill("2");
        page.getByLabel("Comments").fill("mid food");
        page.getByTestId("ReviewForm-submit").click();

        assertThat(page.getByTestId("ReviewTable-cell-row-0-col-comments"))
                .hasText("mid food");

        page.getByTestId("ReviewTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit Review")).isVisible();
        page.getByTestId("ReviewForm-comments").fill("wowwww this was beyond mid");
        page.getByTestId("ReviewForm-submit").click();

        assertThat(page.getByTestId("ReviewTable-cell-row-0-col-comments")).hasText("wowwww this was beyond mid");

        page.getByTestId("ReviewTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("ReviewTable-cell-row-0-col-name")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_review() throws Exception {
        setupUser(false);

        page.getByText("Menu Item Reviews").click();

        assertThat(page.getByText("Create Review")).not().isVisible();
        assertThat(page.getByTestId("ReviewTable-cell-row-0-col-name")).not().isVisible();
    }

    @Test
    public void admin_user_can_see_create_review_button() throws Exception {
        setupUser(true);

        page.getByText("Menu Item Reviews").click();

        assertThat(page.getByText("Create Review")).isVisible();
    }
}