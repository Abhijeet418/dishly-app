package com.project.dishly.repository;

import com.project.dishly.model.Rating;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Rating entity operations.
 * Provides database access methods for rating queries.
 */
@Repository
public interface RatingRepository extends MongoRepository<Rating, String> {
    
    /**
     * Find all ratings for a specific recipe.
     *
     * @param recipeId the recipe ID
     * @return list of ratings
     */
    List<Rating> findByRecipeId(String recipeId);
    
    /**
     * Find a rating by recipe ID and user ID.
     *
     * @param recipeId the recipe ID
     * @param userId the user ID
     * @return Optional containing the rating if found
     */
    Optional<Rating> findByRecipeIdAndUserId(String recipeId, String userId);
    
    /**
     * Check if a user has rated a specific recipe.
     *
     * @param recipeId the recipe ID
     * @param userId the user ID
     * @return true if rating exists, false otherwise
     */
    boolean existsByRecipeIdAndUserId(String recipeId, String userId);
    
    /**
     * Get all ratings by a specific user.
     *
     * @param userId the user ID
     * @return list of ratings
     */
    List<Rating> findByUserId(String userId);
    
    /**
     * Delete all ratings for a specific recipe.
     * Used when recipe is deleted to clean up orphaned ratings.
     *
     * @param recipeId the recipe ID
     */
    void deleteByRecipeId(String recipeId);
}
