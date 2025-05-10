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
public class RecommendationRequestWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_recommendationrequest() throws Exception {
        setupUser(true);

        page.getByText("Recommendations").click();

        page.getByText("Create Recommendation Request").click();
        assertThat(page.getByText("Create New Recommendation Request")).isVisible();
        page.getByLabel("Requester Email").fill("test@email.com");
        page.getByLabel("Professor Email").fill("professor@email.com");
        page.getByLabel("Explanation").fill("test");
        page.getByLabel("Date Requested").fill("2022-01-03T00:00");
        page.getByLabel("Date Needed").fill("2025-01-03T00:00");
        page.getByLabel("Done").selectOption("false");
        page.getByTestId("RecommendationForm-submit").click();

        assertThat(page.getByLabel("Requester Email"))
                .hasValue("test@email.com");

        page.getByTestId("RecommendationTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit Recommendation Request")).isVisible();
        page.getByLabel("Requester Email").fill("test2@email.com");
        page.getByLabel("Done").selectOption("false");
        page.getByText("Update").click();

        assertThat(page.getByLabel("Requester Email")).hasValue("test2@email.com");

        page.getByTestId("RecommendationTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByLabel("Requester Email")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_recommendationrequest() throws Exception {
        setupUser(false);

        page.getByText("Recommendations").click();

        assertThat(page.getByText("Create Recommendation Request")).not().isVisible();
        assertThat(page.getByTestId("RecommendationTable-cell-row-0-col-requesterEmail")).not().isVisible();
    }

    @Test
    public void done_field_shows_up_as_yes_for_true() throws Exception {
        setupUser(true);

        page.getByText("Recommendations").click();

        page.getByText("Create Recommendation Request").click();
        assertThat(page.getByText("Create New Recommendation Request")).isVisible();
        page.getByLabel("Requester Email").fill("test@email.com");
        page.getByLabel("Professor Email").fill("professor@email.com");
        page.getByLabel("Explanation").fill("test");
        page.getByLabel("Date Requested").fill("2022-01-03T00:00");
        page.getByLabel("Date Needed").fill("2025-01-03T00:00");
        page.getByLabel("Done").selectOption("true");
        page.getByTestId("RecommendationForm-submit").click();

        assertThat(page.getByLabel("Done"))
                .hasValue("true");

        page.getByTestId("RecommendationTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("RecommendationTable-cell-row-0-col-name")).not().isVisible();
    }
}