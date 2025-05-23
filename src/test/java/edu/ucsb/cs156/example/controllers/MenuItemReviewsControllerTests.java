package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.MenuItemReview;
import edu.ucsb.cs156.example.entities.UCSBDate;
import edu.ucsb.cs156.example.repositories.MenuItemReviewRepository;
import edu.ucsb.cs156.example.repositories.UCSBDateRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

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

@WebMvcTest(controllers = MenuItemReviewsController.class)
@Import(TestConfig.class)
public class MenuItemReviewsControllerTests extends ControllerTestCase {
    @MockBean
    MenuItemReviewRepository menuItemReviewRepository;

    @MockBean
    UserRepository userRepository;

    @Test
    public void logged_out_users_cannot_get_all() throws Exception {
        mockMvc.perform(get("/api/menuitemreviews/all"))
                .andExpect(status().is(403)); // logged out users can't get all
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_users_can_get_all() throws Exception {
        mockMvc.perform(get("/api/menuitemreviews/all"))
                .andExpect(status().is(200)); // logged
    }

    @Test
    public void logged_out_users_cannot_post() throws Exception {
        mockMvc.perform(post("/api/menuitemreviews/post"))
                .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_regular_users_cannot_post() throws Exception {
        mockMvc.perform(post("/api/menuitemreviews/post"))
                .andExpect(status().is(403)); // only admins can post
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_user_can_get_all_reviews() throws Exception {

        // arrange
        LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

        MenuItemReview review1 = MenuItemReview.builder()
                .itemId(3)
                .reviewerEmail("mhaghighi04")
                .stars(2)
                .comments("mid food")
                .build();

        ArrayList<MenuItemReview> expectedReviews = new ArrayList<>();
        expectedReviews.add(review1);

        when(menuItemReviewRepository.findAll()).thenReturn(expectedReviews);

        // act
        MvcResult response = mockMvc.perform(get("/api/menuitemreviews/all"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(menuItemReviewRepository, times(1)).findAll();
        String expectedJson = mapper.writeValueAsString(expectedReviews);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void an_admin_user_can_post_a_new_review() throws Exception {
        // arrange

        MenuItemReview review1 = MenuItemReview.builder()
                .itemId(3)
                .reviewerEmail("mhaghighi04")
                .stars(2)
                .comments("mid-food")
                .build();

        when(menuItemReviewRepository.save(eq(review1))).thenReturn(review1);

        // act
        MvcResult response = mockMvc.perform(
                post("/api/menuitemreviews/post?itemId=3&reviewerEmail=mhaghighi04&stars=2&comments=mid-food")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(menuItemReviewRepository, times(1)).save(eq(review1));
        String expectedJson = mapper.writeValueAsString(review1);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @Test
    public void logged_out_users_cannot_get_by_id() throws Exception {
        mockMvc.perform(get("/api/menuitemreviews?id=7"))
                .andExpect(status().is(403)); // logged out users can't get by id
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

        // arrange
        LocalDateTime ldt = LocalDateTime.parse("2022-01-03T00:00:00");

        MenuItemReview review1 = MenuItemReview.builder()
                .itemId(3)
                .reviewerEmail("mhaghighi04")
                .stars(2)
                .comments("mid-food")
                .build();

        when(menuItemReviewRepository.findById(eq(7L))).thenReturn(Optional.of(review1));

        // act
        MvcResult response = mockMvc.perform(get("/api/menuitemreviews?id=7"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(menuItemReviewRepository, times(1)).findById(eq(7L));
        String expectedJson = mapper.writeValueAsString(review1);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

        // arrange

        when(menuItemReviewRepository.findById(eq(7L))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(get("/api/menuitemreviews?id=7"))
                .andExpect(status().isNotFound()).andReturn();

        // assert

        verify(menuItemReviewRepository, times(1)).findById(eq(7L));
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("MenuItemReview with id 7 not found", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_can_edit_an_existing_review() throws Exception {
        // arrange

        LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
        LocalDateTime ldt2 = LocalDateTime.parse("2023-01-03T00:00:00");

        MenuItemReview review = MenuItemReview.builder()
                .itemId(3)
                .reviewerEmail("mhaghighi04")
                .stars(2)
                .comments("mid-food")
                .build();

        MenuItemReview reviewEdit = MenuItemReview.builder()
                .itemId(16)
                .reviewerEmail("joeshmoe23")
                .stars(5)
                .comments("str8 buss")
                .build();

        String requestBody = mapper.writeValueAsString(reviewEdit);

        when(menuItemReviewRepository.findById(eq(67L))).thenReturn(Optional.of(review));

        // act
        MvcResult response = mockMvc.perform(
                put("/api/menuitemreviews?id=67")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(menuItemReviewRepository, times(1)).findById(67L);
        verify(menuItemReviewRepository, times(1)).save(reviewEdit); // should be saved with correct user
        String responseString = response.getResponse().getContentAsString();
        assertEquals(requestBody, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_cannot_edit_review_that_does_not_exist() throws Exception {
        // arrange

        MenuItemReview reviewEdit = MenuItemReview.builder()
                .itemId(16)
                .reviewerEmail("joeshmoe23")
                .stars(5)
                .comments("str8 buss")
                .build();

        String requestBody = mapper.writeValueAsString(reviewEdit);

        when(menuItemReviewRepository.findById(eq(67L))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(
                put("/api/menuitemreviews?id=67")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(status().isNotFound()).andReturn();

        // assert
        verify(menuItemReviewRepository, times(1)).findById(67L);
        Map<String, Object> json = responseToJson(response);
        assertEquals("MenuItemReview with id 67 not found", json.get("message"));

    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_can_delete_a_review() throws Exception {
        // arrange


        MenuItemReview review = MenuItemReview.builder()
                .itemId(3)
                .reviewerEmail("mhaghighi04")
                .stars(2)
                .comments("mid-food")
                .build();

        when(menuItemReviewRepository.findById(eq(15L))).thenReturn(Optional.of(review));

        // act
        MvcResult response = mockMvc.perform(
                delete("/api/menuitemreviews?id=15")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(menuItemReviewRepository, times(1)).findById(15L);
        verify(menuItemReviewRepository, times(1)).delete(any());

        Map<String, Object> json = responseToJson(response);
        assertEquals("MenuItemReview with id 15 deleted", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_tries_to_delete_non_existant_review_and_gets_right_error_message()
            throws Exception {
        // arrange

        when(menuItemReviewRepository.findById(eq(15L))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(
                delete("/api/menuitemreviews?id=15")
                        .with(csrf()))
                .andExpect(status().isNotFound()).andReturn();

        // assert
        verify(menuItemReviewRepository, times(1)).findById(15L);
        Map<String, Object> json = responseToJson(response);
        assertEquals("MenuItemReview with id 15 not found", json.get("message"));
    }

}
