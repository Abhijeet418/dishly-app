package com.project.dishly.service;

import com.project.dishly.dto.request.CollectionRequest;
import com.project.dishly.dto.response.CollectionResponse;
import com.project.dishly.dto.response.RecipeListResponse;
import com.project.dishly.exception.ResourceNotFoundException;
import com.project.dishly.exception.UnauthorizedException;
import com.project.dishly.model.Recipe;
import com.project.dishly.model.RecipeCollection;
import com.project.dishly.repository.RecipeCollectionRepository;
import com.project.dishly.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for recipe collection management.
 * Handles creation, retrieval, and management of recipe collections.
 */
@Service
public class CollectionService {
    
    @Autowired
    private RecipeCollectionRepository collectionRepository;
    
    @Autowired
    private RecipeRepository recipeRepository;
    
    /**
     * Create a new collection for the authenticated user.
     *
     * @param collectionRequest the collection data
     * @param userId the authenticated user's ID
     * @return CollectionResponse with created collection details
     */
    public CollectionResponse createCollection(CollectionRequest collectionRequest, String userId) {
        RecipeCollection collection = new RecipeCollection();
        collection.setUserId(userId);
        collection.setName(collectionRequest.getName());
        collection.setRecipeIds(new ArrayList<>());
        
        RecipeCollection savedCollection = collectionRepository.save(collection);
        return mapToCollectionResponse(savedCollection);
    }
    
    /**
     * Get all collections for the authenticated user.
     *
     * @param userId the user's ID
     * @return list of CollectionResponse
     */
    public List<CollectionResponse> getUserCollections(String userId) {
        List<RecipeCollection> collections = collectionRepository.findByUserId(userId);
        
        return collections.stream()
                .map(this::mapToCollectionResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Add a recipe to a collection.
     * Verifies ownership of both collection and recipe.
     *
     * @param collectionId the collection ID
     * @param recipeId the recipe ID to add
     * @param userId the authenticated user's ID
     * @return CollectionResponse with updated collection
     * @throws ResourceNotFoundException if collection not found
     * @throws UnauthorizedException if user is not the owner
     */
    public CollectionResponse addRecipeToCollection(String collectionId, String recipeId, String userId) {
        RecipeCollection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Collection not found"));
        
        if (!collection.getUserId().equals(userId)) {
            throw new UnauthorizedException("You can only modify your own collections");
        }
        
        // Avoid duplicates
        if (!collection.getRecipeIds().contains(recipeId)) {
            collection.getRecipeIds().add(recipeId);
            RecipeCollection updatedCollection = collectionRepository.save(collection);
            return mapToCollectionResponse(updatedCollection);
        }
        
        return mapToCollectionResponse(collection);
    }
    
    /**
     * Remove a recipe from a collection.
     * Verifies ownership of collection.
     *
     * @param collectionId the collection ID
     * @param recipeId the recipe ID to remove
     * @param userId the authenticated user's ID
     * @return CollectionResponse with updated collection
     * @throws ResourceNotFoundException if collection not found
     * @throws UnauthorizedException if user is not the owner
     */
    public CollectionResponse removeRecipeFromCollection(String collectionId, String recipeId, String userId) {
        RecipeCollection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Collection not found"));
        
        if (!collection.getUserId().equals(userId)) {
            throw new UnauthorizedException("You can only modify your own collections");
        }
        
        collection.getRecipeIds().remove(recipeId);
        RecipeCollection updatedCollection = collectionRepository.save(collection);
        
        return mapToCollectionResponse(updatedCollection);
    }
    
    /**
     * Delete a collection.
     * Verifies ownership before deletion.
     *
     * @param id the collection ID
     * @param userId the authenticated user's ID
     * @throws ResourceNotFoundException if collection not found
     * @throws UnauthorizedException if user is not the owner
     */
    public void deleteCollection(String id, String userId) {
        RecipeCollection collection = collectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Collection not found"));
        
        if (!collection.getUserId().equals(userId)) {
            throw new UnauthorizedException("You can only delete your own collections");
        }
        
        collectionRepository.delete(collection);
    }
    
    /**
     * Get all recipes in a collection.
     * Verifies ownership of collection.
     *
     * @param collectionId the collection ID
     * @param userId the authenticated user's ID
     * @return list of RecipeListResponse
     * @throws ResourceNotFoundException if collection not found
     * @throws UnauthorizedException if user is not the owner
     */
    public List<RecipeListResponse> getCollectionRecipes(String collectionId, String userId) {
        RecipeCollection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Collection not found"));
        
        if (!collection.getUserId().equals(userId)) {
            throw new UnauthorizedException("You can only view your own collections");
        }
        
        if (collection.getRecipeIds() == null || collection.getRecipeIds().isEmpty()) {
            return new ArrayList<>();
        }
        
        // Fetch recipes by their IDs
        List<Recipe> recipes = recipeRepository.findByIdIn(collection.getRecipeIds());
        
        return recipes.stream()
                .map(this::mapToRecipeListResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Map Recipe entity to RecipeListResponse DTO.
     *
     * @param recipe the Recipe entity
     * @return RecipeListResponse DTO
     */
    private RecipeListResponse mapToRecipeListResponse(Recipe recipe) {
        return new RecipeListResponse(
                recipe.getId(),
                recipe.getTitle(),
                recipe.getImageUrls(),
                recipe.getPrepTimeMinutes(),
                recipe.getCookTimeMinutes(),
                recipe.getAverageRating(),
                recipe.getRatingCount(),
                recipe.getLikeCount() != null ? recipe.getLikeCount() : 0,
                false,
                recipe.getCategories(),
                recipe.getDifficulty().toString(),
                recipe.getServings(),
                recipe.getUsername()
        );
    }
    
    /**
     * Map RecipeCollection entity to CollectionResponse DTO.
     *
     * @param collection the RecipeCollection entity
     * @return CollectionResponse DTO
     */
    private CollectionResponse mapToCollectionResponse(RecipeCollection collection) {
        return new CollectionResponse(
                collection.getId(),
                collection.getName(),
                collection.getRecipeIds() != null ? collection.getRecipeIds().size() : 0,
                collection.getRecipeIds(),
                collection.getCreatedAt()
        );
    }
}
