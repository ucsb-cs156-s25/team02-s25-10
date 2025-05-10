package edu.ucsb.cs156.example.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import edu.ucsb.cs156.example.entities.HelpRequest;
import edu.ucsb.cs156.example.repositories.HelpRequestRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.CurrentUserService;
import edu.ucsb.cs156.example.services.GrantedAuthoritiesService;
import edu.ucsb.cs156.example.testconfig.TestConfig;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@Import(TestConfig.class)
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class HelpRequestIT {

    @Autowired
    public CurrentUserService currentUserService;

    @Autowired
    public GrantedAuthoritiesService grantedAuthoritiesService;

    @Autowired
    HelpRequestRepository helprequestsRepository;

    @Autowired
    public MockMvc mockMvc;

    @Autowired
    public ObjectMapper mapper;

    @MockBean
    UserRepository userRepository;

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {
        HelpRequest helpRequest = HelpRequest.builder()
            .requesterEmail("jane@ucsb.edu")
            .teamId("T123")
            .tableOrBreakoutRoom("Room 5B")
            .requestTime(LocalDateTime.parse("2025-04-25T21:30:00"))
            .explanation("Need help debugging SQL error")
            .solved(false)
            .build();

        helprequestsRepository.save(helpRequest);

        MvcResult response = mockMvc.perform(get("/api/helprequests?id=1"))
            .andExpect(status().isOk()).andReturn();

        String responseString = response.getResponse().getContentAsString();
        HelpRequest actual = mapper.readValue(responseString, HelpRequest.class);

        assertEquals(helpRequest.getRequesterEmail(), actual.getRequesterEmail());
        assertEquals(helpRequest.getTeamId(), actual.getTeamId());
        assertEquals(helpRequest.getTableOrBreakoutRoom(), actual.getTableOrBreakoutRoom());
        assertEquals(helpRequest.getRequestTime(), actual.getRequestTime());
        assertEquals(helpRequest.getExplanation(), actual.getExplanation());
        assertEquals(helpRequest.getSolved(), actual.getSolved());
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void an_admin_user_can_post_a_new_helprequest() throws Exception {
        LocalDateTime ldt1 = LocalDateTime.parse("2025-04-25T21:30:00");

        MvcResult response = mockMvc.perform(
                post("/api/helprequests/post")
                    .param("requesterEmail", "jane@ucsb.edu")
                    .param("teamId", "T123")
                    .param("tableOrBreakoutRoom", "Room 5B")
                    .param("requestTime", "2025-04-25T21:30:00")
                    .param("explanation", "Need help debugging SQL error")
                    .param("solved", "false")
                    .with(csrf()))
                .andExpect(status().isOk())
                .andReturn();

        String responseString = response.getResponse().getContentAsString();
        HelpRequest actual = mapper.readValue(responseString, HelpRequest.class);

        assertEquals("jane@ucsb.edu", actual.getRequesterEmail());
        assertEquals("T123", actual.getTeamId());
        assertEquals("Room 5B", actual.getTableOrBreakoutRoom());
        assertEquals(ldt1, actual.getRequestTime());
        assertEquals("Need help debugging SQL error", actual.getExplanation());
        assertEquals(false, actual.getSolved());
    }
}