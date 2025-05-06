package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.Articles;
import edu.ucsb.cs156.example.entities.UCSBDate;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.ArticlesRepository;

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

/**
 * This is a REST controller for UCSBDates
 */

@Tag(name = "Articles")
@RequestMapping("/api/articles")
@RestController
@Slf4j
public class ArticlesController extends ApiController {

    @Autowired
    ArticlesRepository ArticlesRepository;

    /**
     * List all UCSB articles
     * 
     * @return an iterable of UCSBArticles
     */
    @Operation(summary= "List all ucsb articles")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<Articles> allArticles() {
        Iterable<Articles> articles = ArticlesRepository.findAll();
        return articles;
    }

    /**
     * Get a single article by id
     * 
     * @param id the id of the article
     * @return a UCSBArticle
     */
    @Operation(summary= "Get a single article")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public Articles getById(
            @Parameter(name="id") @RequestParam Long id) {
        Articles Article = ArticlesRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Articles.class, id));

        return Article;
    }

    /**
     
     */
    @Operation(summary= "Create a new article")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public Articles postUCSBArticles(
            @Parameter(name="title") @RequestParam String title,
            @Parameter(name="url") @RequestParam String url,
            @Parameter(name="explanation") @RequestParam String explanation,
            @Parameter(name="email") @RequestParam String email,
            @Parameter(name="localDateTime", description="date (in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601)") @RequestParam("localDateTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime localDateTime)
            throws JsonProcessingException {

        log.info("localDateTime={}", localDateTime);

        Articles Article = new Articles();
        Article.setTitle(title);
        Article.setUrl(url);
        Article.setExplanation(explanation);
        Article.setEmail(email);
        Article.setLocalDateTime(localDateTime);

        Articles savedUcsbArticle = ArticlesRepository.save(Article);

        return savedUcsbArticle;
    }

     /**
     * Update a single date
     * private String title;
        private String url;
        private String explanation;
        private String email;
        private LocalDateTime localDateTime;
     */
    @Operation(summary= "Update a single article")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public Articles updateArticles(
            @Parameter(name="id") @RequestParam Long id,
            @RequestBody @Valid Articles incoming) {

            Articles Article = ArticlesRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Articles.class, id));

        Article.setTitle(incoming.getTitle());
        Article.setUrl(incoming.getUrl());
        Article.setExplanation(incoming.getExplanation());
        Article.setEmail(incoming.getEmail());
        Article.setLocalDateTime(incoming.getLocalDateTime());

        ArticlesRepository.save(Article);

        return Article;
    }

     /**
     * Delete an Article
     * 
     * @param id the id of the article to delete
     * @return a message indicating the date was deleted
     */
    @Operation(summary= "Delete a Article")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteArticle(
            @Parameter(name="id") @RequestParam Long id) {
        Articles Article = ArticlesRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Article.class, id));

        ArticlesRepository.delete(Article);
        return genericMessage("UCSBArticles with id %s deleted".formatted(id));
    }

}