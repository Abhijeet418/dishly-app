package com.project.dishly.controller;

import com.project.dishly.dto.request.CollectionRequest;
import com.project.dishly.dto.response.CollectionResponse;
import com.project.dishly.dto.response.MessageResponse;
import com.project.dishly.dto.response.RecipeListResponse;
import com.project.dishly.service.CollectionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for recipe collection endpoints.
 * Handles creation and management of recipe collections.
 */
@RestController
@RequestMapping("/api/collections")
@Tag(name = "Collections", description = "Manage recipe collections and organize recipes")
public class CollectionController {
    
    @Autowired
    private CollectionService collectionService;
    
    /**
     * Create a new collection.
     * POST /api/collections
     *
     * @param collectionRequest the collection data
     * @param authentication Spring Security authentication object
     * @return CollectionResponse with created collection
     */
    @PostMapping
    @Operation(
            summary = "Create a new collection",
            description = "Create a new recipe collection for organizing recipes",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Collection created successfully",
                            content = @Content(schema = @Schema(implementation = CollectionResponse.class))),
                    @ApiResponse(responseCode = "400", description = "Invalid collection data"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized")
            }
    )
    public ResponseEntity<CollectionResponse> createCollection(
            @Valid @RequestBody CollectionRequest collectionRequest,
            Authentication authentication) {
        
        String userEmail = extractEmailFromAuth(authentication);
        CollectionResponse collectionResponse = collectionService.createCollection(collectionRequest, userEmail);
        
        return new ResponseEntity<>(collectionResponse, HttpStatus.CREATED);
    }
    
    /**
     * Get all collections for the authenticated user.
     * GET /api/collections
     *
     * @param authentication Spring Security authentication object
     * @return list of CollectionResponse
     */
    @GetMapping
    @Operation(
            summary = "Get user collections",
            description = "Retrieve all recipe collections for the authenticated user",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Collections retrieved successfully",
                            content = @Content(schema = @Schema(implementation = CollectionResponse.class))),
                    @ApiResponse(responseCode = "401", description = "Unauthorized")
            }
    )
    public ResponseEntity<List<CollectionResponse>> getUserCollections(Authentication authentication) {
        String userEmail = extractEmailFromAuth(authentication);
        List<CollectionResponse> collections = collectionService.getUserCollections(userEmail);
        
        return ResponseEntity.ok(collections);
    }
    
    /**
     * Add a recipe to a collection.
     * POST /api/collections/{id}/recipes/{recipeId}
     *
     * @param id the collection ID
     * @param recipeId the recipe ID to add
     * @param authentication Spring Security authentication object
     * @return CollectionResponse with updated collection
     */
    @PostMapping("/{id}/recipes/{recipeId}")
    @Operation(
            summary = "Add recipe to collection",
            description = "Add a recipe to an existing collection",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Recipe added successfully",
                            content = @Content(schema = @Schema(implementation = CollectionResponse.class))),
                    @ApiResponse(responseCode = "400", description = "Invalid collection or recipe ID"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "404", description = "Collection or recipe not found")
            }
    )
    public ResponseEntity<CollectionResponse> addRecipeToCollection(
            @PathVariable String id,
            @PathVariable String recipeId,
            Authentication authentication) {
        
        String userEmail = extractEmailFromAuth(authentication);
        CollectionResponse collectionResponse = collectionService.addRecipeToCollection(id, recipeId, userEmail);
        
        return ResponseEntity.ok(collectionResponse);
    }
    
    /**
     * Get all recipes in a collection.
     * GET /api/collections/{id}/recipes
     *
     * @param id the collection ID
     * @param authentication Spring Security authentication object
     * @return list of RecipeListResponse
     */
    @GetMapping("/{id}/recipes")
    @Operation(
            summary = "Get collection recipes",
            description = "Retrieve all recipes in a collection",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Recipes retrieved successfully"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "404", description = "Collection not found")
            }
    )
    public ResponseEntity<?> getCollectionRecipes(
            @PathVariable String id,
            Authentication authentication) {
        
        String userEmail = extractEmailFromAuth(authentication);
        try {
            List<RecipeListResponse> recipes = collectionService.getCollectionRecipes(id, userEmail);
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    /**
     * Remove a recipe from a collection.
     * DELETE /api/collections/{id}/recipes/{recipeId}
     *
     * @param id the collection ID
     * @param recipeId the recipe ID to remove
     * @param authentication Spring Security authentication object
     * @return success message
     */
    @DeleteMapping("/{id}/recipes/{recipeId}")
    @Operation(
            summary = "Remove recipe from collection",
            description = "Remove a recipe from an existing collection",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Recipe removed successfully",
                            content = @Content(schema = @Schema(implementation = MessageResponse.class))),
                    @ApiResponse(responseCode = "400", description = "Invalid collection or recipe ID"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "404", description = "Collection or recipe not found")
            }
    )
    public ResponseEntity<MessageResponse> removeRecipeFromCollection(
            @PathVariable String id,
            @PathVariable String recipeId,
            Authentication authentication) {
        
        String userEmail = extractEmailFromAuth(authentication);
        collectionService.removeRecipeFromCollection(id, recipeId, userEmail);
        
        return ResponseEntity.ok(new MessageResponse("Recipe removed from collection successfully"));
    }
    
    /**
     * Delete a collection.
     * DELETE /api/collections/{id}
     *
     * @param id the collection ID
     * @param authentication Spring Security authentication object
     * @return success message
     */
    @DeleteMapping("/{id}")
    @Operation(
            summary = "Delete collection",
            description = "Delete an existing collection and all its references",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Collection deleted successfully",
                            content = @Content(schema = @Schema(implementation = MessageResponse.class))),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "404", description = "Collection not found")
            }
    )
    public ResponseEntity<MessageResponse> deleteCollection(
            @PathVariable String id,
            Authentication authentication) {
        
        String userEmail = extractEmailFromAuth(authentication);
        collectionService.deleteCollection(id, userEmail);
        
        return ResponseEntity.ok(new MessageResponse("Collection deleted successfully"));
    }
    
    /**
     * Extract user email from authentication object.
     *
     * @param authentication the authentication object
     * @return user email
     */
    private String extractEmailFromAuth(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userDetails.getUsername();
    }
}
