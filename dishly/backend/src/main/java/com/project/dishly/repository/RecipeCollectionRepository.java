package com.project.dishly.repository;

import com.project.dishly.model.RecipeCollection;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for RecipeCollection entity operations.
 * Provides database access methods for recipe collection queries.
 */
@Repository
public interface RecipeCollectionRepository extends MongoRepository<RecipeCollection, String> {
    
    /**
     * Find all collections belonging to a specific user.
     *
     * @param userId the user ID
     * @return list of collections
     */
    List<RecipeCollection> findByUserId(String userId);
}
