package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.Articles;
import edu.ucsb.cs156.example.repositories.ArticlesRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.time.LocalDateTime;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = ArticlesController.class)
@Import(TestConfig.class)
public class ArticlesControllerTests extends ControllerTestCase {

        @MockBean
        ArticlesRepository ArticlesRepository;

        @MockBean
        UserRepository userRepository;

        // Authorization tests for /api/ucsbArticles/admin/all

        @Test
        public void logged_out_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/articles/all"))
                                .andExpect(status().is(403)); // logged out users can't get all
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_can_get_all() throws Exception {
                mockMvc.perform(get("/api/articles/all"))
                                .andExpect(status().is(200)); // logged
        }

        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/articles?id=7"))
                                .andExpect(status().is(403)); // logged out users can't get by id
        }

        // Authorization tests for /api/ucsbArticles/post
        // (Perhaps should also have these for put and delete)
//
        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/articles/post"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_regular_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/articles/post"))
                                .andExpect(status().is(403)); // only admins can post
        }

        // // Tests with mocks for database actions

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

                // arrange
                LocalDateTime ldt = LocalDateTime.parse("2022-04-20T00:00:00");

                Articles Article = Articles.builder()
                                .title("\tUsing testing-playground with React Testing Library")
                                .url("https://dev.to/katieraby/using-testing-playground-with-react-testing-library-26j7")
                                .explanation("Helpful when we get to front end development")
                                .email("phtcon@ucsb.edu\t")
                                .localDateTime(ldt)
                                .build();

                when(ArticlesRepository.findById(eq(1L))).thenReturn(Optional.of(Article));

                // act
                MvcResult response = mockMvc.perform(get("/api/articles?id=1"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(ArticlesRepository, times(1)).findById(eq(1L));
                String expectedJson = mapper.writeValueAsString(Article);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                when(ArticlesRepository.findById(eq(7L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/articles?id=7"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(ArticlesRepository, times(1)).findById(eq(7L));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("Articles with id 7 not found", json.get("message"));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_user_can_get_all_Articles() throws Exception {

                // arrange
                LocalDateTime ldt1 = LocalDateTime.parse("2022-04-20T00:00:00");

                Articles Article1 = Articles.builder()
                                .title("Using testing-playground with React Testing Library")
                                .url("https://dev.to/katieraby/using-testing-playground-with-react-testing-library-26j7")
                                .explanation("Helpful when we get to front end development")
                                .email("phtcon@ucsb.edu\t")
                                .localDateTime(ldt1)
                                .build();

                LocalDateTime ldt2 = LocalDateTime.parse("2022-04-19T00:00:00");

                Articles Article2 = Articles.builder()
                                .title("Handy Spring Utility Classes")
                                .url("https://twitter.com/maciejwalkowiak/status/1511736828369719300?t=gGXpmBH4y4eY9OBSUInZEg&s=09")
                                .explanation("A lot of really useful classes are built into Spring")
                                .email("phtcon@ucsb.edu\t")
                                .localDateTime(ldt2)
                                .build();

                ArrayList<Articles> expectedArticles = new ArrayList<>();
                expectedArticles.addAll(Arrays.asList(Article1, Article2));

                when(ArticlesRepository.findAll()).thenReturn(expectedArticles);

                // act
                MvcResult response = mockMvc.perform(get("/api/articles/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(ArticlesRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedArticles);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_article() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

                Articles Article1 = Articles.builder()
                                .title("a")
                                .url("https://team01-dev-junjiel123.dokku-10.cs.ucsb.edu")
                                .explanation("b")
                                .email("phtcon@ucsb.edu")
                                .localDateTime(ldt1)
                                .build();

                when(ArticlesRepository.save(eq(Article1))).thenReturn(Article1);

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/articles/post?title=a&url=https://team01-dev-junjiel123.dokku-10.cs.ucsb.edu&explanation=b&email=phtcon@ucsb.edu&localDateTime=2022-01-03T00:00:00")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(ArticlesRepository, times(1)).save(Article1);
                String expectedJson = mapper.writeValueAsString(Article1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_edit_an_existing_article() throws Exception {
                // arrange
                Long id = 3L;

                LocalDateTime originalDateTime = LocalDateTime.parse("2022-01-03T00:00:00");
                LocalDateTime updatedDateTime = LocalDateTime.parse("2022-04-25T12:00:00");

                Articles originalArticle = Articles.builder()
                        .id(id)
                        .title("Original Title")
                        .url("https://example.com/original")
                        .explanation("Original Explanation")
                        .email("original@example.com")
                        .localDateTime(originalDateTime)
                        .build();

                Articles updatedArticle = Articles.builder()
                        .id(id)
                        .title("Updated Title")
                        .url("https://example.com/updated")
                        .explanation("Updated Explanation")
                        .email("updated@example.com")
                        .localDateTime(updatedDateTime)
                        .build();

                when(ArticlesRepository.findById(id)).thenReturn(Optional.of(originalArticle));
                when(ArticlesRepository.save(any(Articles.class))).thenReturn(updatedArticle);

                String requestBody = mapper.writeValueAsString(updatedArticle);

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/articles?id=" + id)
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .characterEncoding("utf-8")
                                        .content(requestBody)
                                        .with(csrf()))
                        .andExpect(status().isOk())
                        .andReturn();

                // assert
                verify(ArticlesRepository, times(1)).findById(id);
                verify(ArticlesRepository, times(1)).save(any(Articles.class));

                String responseString = response.getResponse().getContentAsString();
                String expectedJson = mapper.writeValueAsString(updatedArticle);

                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_update_nonexistent_article() throws Exception {
        // arrange
                Long id = 123L;

                Articles incomingArticle = Articles.builder()
                        .title("Updated Title")
                        .url("https://example.com/updated")
                        .explanation("Updated Explanation")
                        .email("updated@example.com")
                        .localDateTime(LocalDateTime.now())
                        .build();

                when(ArticlesRepository.findById(id)).thenReturn(Optional.empty());

                String requestBody = mapper.writeValueAsString(incomingArticle);

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/articles?id=" + id)
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .characterEncoding("utf-8")
                                        .content(requestBody)
                                        .with(csrf()))
                        .andExpect(status().isNotFound())
                        .andReturn();

                // assert
                verify(ArticlesRepository, times(1)).findById(id);

                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("Articles with id 123 not found", json.get("message"));
        }



        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_existing_article() throws Exception {
        // arrange
                Long id = 123L;

                Articles article = Articles.builder()
                        .id(id)
                        .title("Sample Title")
                        .url("https://example.com")
                        .explanation("Sample Explanation")
                        .email("sample@example.com")
                        .localDateTime(LocalDateTime.now())
                        .build();

                when(ArticlesRepository.findById(id)).thenReturn(Optional.of(article));

                // act
                MvcResult response = mockMvc.perform(
                        delete("/api/articles?id=" + id)
                                .with(csrf()))
                        .andExpect(status().isOk())
                        .andReturn();

                // assert
                verify(ArticlesRepository, times(1)).findById(id);
                verify(ArticlesRepository, times(1)).delete(article);

                Map<String, Object> json = responseToJson(response);
                assertEquals("Articles with id 123 deleted", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_delete_nonexistent_article() throws Exception {
        // arrange
                Long id = 123L;

                when(ArticlesRepository.findById(id)).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                        delete("/api/articles?id=" + id)
                                .with(csrf()))
                        .andExpect(status().isNotFound())
                        .andReturn();

                // assert
                verify(ArticlesRepository, times(1)).findById(id);

                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("Articles with id 123 not found", json.get("message"));
        }




}