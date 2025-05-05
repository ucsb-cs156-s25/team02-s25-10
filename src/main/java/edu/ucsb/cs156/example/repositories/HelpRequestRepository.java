package edu.ucsb.cs156.example.repositories;

import edu.ucsb.cs156.example.entities.HelpRequest;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * The UCSBDateRepository is a repository for UCSBDate entities.
 */

@Repository
public interface HelpRequestRepository extends CrudRepository<HelpRequest, Long> {
  
}