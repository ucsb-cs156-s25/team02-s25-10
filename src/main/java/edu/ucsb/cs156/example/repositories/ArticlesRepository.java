package edu.ucsb.cs156.example.repositories;

import edu.ucsb.cs156.example.entities.Articles;
import edu.ucsb.cs156.example.entities.UCSBDate;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * The UCSBDateRepository is a repository for UCSBDate entities.
 */

@Repository
public interface ArticlesRepository extends CrudRepository<Articles, Long> {
}
//