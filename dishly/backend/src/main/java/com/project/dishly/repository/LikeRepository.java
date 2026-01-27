package com.project.dishly.repository;

import com.project.dishly.model.Like;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for Like entity operations.
 * Provides database access methods for like queries.
 */
@Repository
public interface LikeRepository extends MongoRepository<Like, String> {
    
    /**
     * Find a like by recipe ID and user ID.
     *
     * @param recipeId the recipe ID
     * @param userId the user ID
     * @return Optional containing the like if found
     */
    Optional<Like> findByRecipeIdAndUserId(String recipeId, String userId);
    
    /**
     * Count likes for a recipe.
     *
     * @param recipeId the recipe ID
     * @return number of likes
     */
    long countByRecipeId(String recipeId);
    
    /**
     * Delete a like by recipe ID and user ID.
     *
     * @param recipeId the recipe ID
     * @param userId the user ID
     */
    void deleteByRecipeIdAndUserId(String recipeId, String userId);
}
