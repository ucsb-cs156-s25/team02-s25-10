package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.RecommendationRequest;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.RecommendationRequestRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import java.time.LocalDateTime;

import org.apache.logging.log4j.message.ReusableMessage;

/**
 * This is a REST controller for RecommendationRequests
 */

@Tag(name = "RecommendationRequests")
@RequestMapping("/api/recommendationrequests")
@RestController
@Slf4j
public class RecommendationRequestsController extends ApiController{

    @Autowired
    RecommendationRequestRepository recommendationRequestRepository;

    /**
     * List all RecommendationRequests dates
     * 
     * @return an iterable of RecommendationRequest
     */
    @Operation(summary= "List all recommendation request dates")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<RecommendationRequest> allRecommendationRequests() {
        Iterable<RecommendationRequest> requests = recommendationRequestRepository.findAll();
        return requests;
    }

    /**
     * Create a new date
     * 
     * @param requesterEmail  the email of the requester
     * @param professorEmail  the email of the professor
     * @param explanation     the explanation for the request
     * @param dateRequested   the date of the request
     * @param dateNeeded      the due date of the request
     * @param done            whether the request is done or not
     * @return the saved recommendation request
     */
    @Operation(summary= "Create a new date")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public RecommendationRequest postRecommendationRequest(
            @Parameter(name="requesterEmail") @RequestParam String requesterEmail,
            @Parameter(name="professorEmail") @RequestParam String professorEmail,
            @Parameter(name="explanation") @RequestParam String explanation,
            @Parameter(name="dateRequested", description="date (in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601)") @RequestParam("dateRequested") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateRequested,
            @Parameter(name="dateNeeded", description="date (in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601)") @RequestParam("dateNeeded") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateNeeded,
            @Parameter(name="done") @RequestParam Boolean done)
            throws JsonProcessingException {

        // For an explanation of @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        // See: https://www.baeldung.com/spring-date-parameters

        log.info("recommendationRequestTime={}", dateRequested);

        RecommendationRequest recommendationRequest = new RecommendationRequest();
        recommendationRequest.setRequesterEmail(requesterEmail);
        recommendationRequest.setProfessorEmail(professorEmail);
        recommendationRequest.setExplanation(explanation);
        recommendationRequest.setDateRequested(dateRequested);
        recommendationRequest.setDateNeeded(dateNeeded);
        recommendationRequest.setDone(done);

        RecommendationRequest savedRecommendationRequest = recommendationRequestRepository.save(recommendationRequest);

        return savedRecommendationRequest;
    }

    /**
     * Get a single recommendation request by id
     * 
     * @param id the id of the recommendation request
     * @return a RecommendationRequest
     */
    @Operation(summary = "Get a single recommendation request")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping
    public RecommendationRequest getById(
            @Parameter(name = "id") @RequestParam Long id) {
        RecommendationRequest request = recommendationRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(RecommendationRequest.class, id));

        return request;
    }

    /**
     * Update a single recommendation request
     * 
     * @param id       id of the date to update
     * @param incoming the new recommendation request
     * @return the updated request object
     */
    @Operation(summary= "Update a single recommendation request")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public RecommendationRequest updateRecommendationRequest(
            @Parameter(name="id") @RequestParam Long id,
            @RequestBody @Valid RecommendationRequest incoming) {

        RecommendationRequest request = recommendationRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(RecommendationRequest.class, id));

        request.setRequesterEmail(incoming.getRequesterEmail());
        request.setProfessorEmail(incoming.getProfessorEmail());
        request.setExplanation(incoming.getExplanation());
        request.setDateRequested(incoming.getDateRequested());
        request.setDateNeeded(incoming.getDateNeeded());
        request.setDone(incoming.getDone());

        recommendationRequestRepository.save(request);

        return request;
    }

    /**
     * Delete a Recommendation Request
     * 
     * @param id the id of the recommmendation request to delete
     * @return a message indicating the recommendation request was deleted
     */
    @Operation(summary= "Delete a RecommendationRequest")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteRecommendationRequest(
            @Parameter(name="id") @RequestParam Long id) {
        RecommendationRequest recommendationRequest = recommendationRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(RecommendationRequest.class, id));

        recommendationRequestRepository.delete(recommendationRequest);
        return genericMessage("RecommendationRequest with id %s deleted".formatted(id));
    }
}