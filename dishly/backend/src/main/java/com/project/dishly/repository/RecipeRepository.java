package com.project.dishly.repository;

import com.project.dishly.model.Recipe;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Recipe entity operations.
 * Provides database access methods for recipe queries and searches.
 */
@Repository
public interface RecipeRepository extends MongoRepository<Recipe, String> {
    
    /**
     * Find all recipes belonging to a specific user.
     *
     * @param userId the user ID
     * @return list of recipes
     */
    List<Recipe> findByUserId(String userId);
    
    /**
     * Find recipes by user ID and title containing specified text (case-insensitive).
     *
     * @param userId the user ID
     * @param title the title search text
     * @return list of matching recipes
     */
    List<Recipe> findByUserIdAndTitleContainingIgnoreCase(String userId, String title);
    
    /**
     * Find all public recipes.
     *
     * @return list of public recipes
     */
    List<Recipe> findByIsPublicTrue();
    
    /**
     * Find all public recipes with pagination.
     *
     * @param pageable pagination information
     * @return page of recipes
     */
    Page<Recipe> findByIsPublicTrue(Pageable pageable);
    
    /**
     * Find public recipes by title (case-insensitive) with pagination.
     *
     * @param title the title search text
     * @param pageable pagination information
     * @return page of recipes
     */
    Page<Recipe> findByIsPublicTrueAndTitleContainingIgnoreCase(String title, Pageable pageable);
    
    /**
     * Find public recipes containing a specific category with pagination.
     *
     * @param category the category to search for
     * @param pageable pagination information
     * @return page of recipes
     */
    Page<Recipe> findByIsPublicTrueAndCategoriesContaining(String category, Pageable pageable);
    
    /**
     * Find public recipes containing a specific category (case-insensitive) with pagination.
     *
     * @param category the category to search for (case-insensitive)
     * @param pageable pagination information
     * @return page of recipes
     */
    @Query("{ 'isPublic': true, 'categories': { $regex: ?0, $options: 'i' } }")
    Page<Recipe> findByIsPublicTrueAndCategoriesContainingIgnoreCase(String category, Pageable pageable);
    
    /**
     * Find public recipes by title and category (case-insensitive) with pagination.
     *
     * @param title the title search text
     * @param category the category to search for
     * @param pageable pagination information
     * @return page of recipes
     */
    @Query("{ 'isPublic': true, 'title': { $regex: ?0, $options: 'i' }, 'categories': { $regex: ?1, $options: 'i' } }")
    Page<Recipe> findByIsPublicTrueAndTitleContainingIgnoreCaseAndCategoriesContainingIgnoreCase(String title, String category, Pageable pageable);
    
    /**
     * Find user recipes containing a specific category.
     *
     * @param userId the user ID
     * @param category the category to search for
     * @return list of recipes
     */
    List<Recipe> findByUserIdAndCategoriesContaining(String userId, String category);
    
    /**
     * Find user recipes containing a specific tag.
     *
     * @param userId the user ID
     * @param tag the tag to search for
     * @return list of recipes
     */
    List<Recipe> findByUserIdAndTagsContaining(String userId, String tag);
    
    /**
     * Search recipes by ingredient name within user's recipes.
     * Uses custom MongoDB query to search within embedded ingredient list.
     *
     * @param userId the user ID
     * @param ingredientName the ingredient name to search for
     * @return list of recipes containing the ingredient
     */
    @Query("{ 'userId': ?0, 'ingredients.name': { $regex: ?1, $options: 'i' } }")
    List<Recipe> findByUserIdAndIngredientName(String userId, String ingredientName);
    
    /**
     * Find recipes by a list of IDs.
     *
     * @param ids the list of recipe IDs
     * @return list of recipes matching the IDs
     */
    List<Recipe> findByIdIn(List<String> ids);
    
    /**
     * Search public recipes by multiple fields (title, description, tags, username).
     * Uses MongoDB text search capabilities.
     *
     * @param searchTerm the search term
     * @param pageable pagination information
     * @return page of recipes matching the search
     */
    @Query("{ 'isPublic': true, $text: { $search: ?0 } }")
    Page<Recipe> searchPublicRecipes(String searchTerm, Pageable pageable);
    
    /**
     * Find public recipes by username.
     *
     * @param username the username to search for
     * @param pageable pagination information
     * @return page of recipes
     */
    Page<Recipe> findByIsPublicTrueAndUsernameContainingIgnoreCase(String username, Pageable pageable);
    
    /**
     * Find public recipes by description (case-insensitive).
     *
     * @param description the description text to search for
     * @param pageable pagination information
     * @return page of recipes
     */
    @Query("{ 'isPublic': true, 'description': { $regex: ?0, $options: 'i' } }")
    Page<Recipe> findByIsPublicTrueAndDescriptionContainingIgnoreCase(String description, Pageable pageable);
}
