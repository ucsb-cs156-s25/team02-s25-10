package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import java.time.LocalDateTime;

import edu.ucsb.cs156.example.WebTestCase;
import edu.ucsb.cs156.example.entities.HelpRequest;
import edu.ucsb.cs156.example.repositories.HelpRequestRepository;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class HelpRequestWebIT extends WebTestCase {

    @Autowired
    HelpRequestRepository helprequestsRepository;

    @Test
    public void admin_user_sees_seeded_help_request_in_table() throws Exception {
        setupUser(true);

        // Seed the DB
        HelpRequest helpRequest = HelpRequest.builder()
            .requesterEmail("jane@ucsb.edu")
            .teamId("T123")
            .tableOrBreakoutRoom("Room 5B")
            .requestTime(LocalDateTime.parse("2025-04-25T21:30:00"))
            .explanation("Need help debugging SQL error")
            .solved(false)
            .build();

        helprequestsRepository.save(helpRequest);

        // Visit the Help Requests page
        page.getByText("Help Requests").click();

        // Assert the table shows the seeded request
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
            .hasText("jane@ucsb.edu");

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-tableOrBreakoutRoom"))
            .hasText("Room 5B");

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-explanation"))
            .hasText("Need help debugging SQL error");

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-solved"))
            .hasText("No");
    }

    @Test
    public void regular_user_cannot_create_help_request() throws Exception {
        setupUser(false);

        page.getByText("Help Requests").click();

        assertThat(page.getByText("Create Help Request")).not().isVisible();
    }

    @Test
    public void admin_user_can_see_help_request_create_button() throws Exception {
        setupUser(true);

        page.getByText("Help Requests").click();

        assertThat(page.getByText("Create Help Request")).isVisible();
    }
}

