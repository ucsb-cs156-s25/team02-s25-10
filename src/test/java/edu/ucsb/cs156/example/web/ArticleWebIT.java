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
import edu.ucsb.cs156.example.entities.Articles;
import edu.ucsb.cs156.example.repositories.ArticlesRepository;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class ArticleWebIT extends WebTestCase {

    @Autowired
    ArticlesRepository articlesRepository;
    @Test
    public void admin_user_can_create_edit_delete_article() throws Exception {
        setupUser(true);

        Articles article = Articles.builder()
                .title("Sample Title")
                .url("https://example.com")
                .explanation("This is a test article.")
                .email("test@example.com")
                .localDateTime(LocalDateTime.parse("2022-01-01T00:00:00"))
                .build();

        articlesRepository.save(article);
        
        page.getByText("Articles").click();

        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-title")).hasText("Sample Title");

        page.getByTestId("ArticlesTable-cell-row-0-col-Delete").click();

        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-title")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_article() throws Exception {
        setupUser(false);

        page.getByText("Articles").click();

        assertThat(page.getByText("Create Article")).not().isVisible();
        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-name")).not().isVisible();
    }
}