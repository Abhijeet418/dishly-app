package com.project.dishly.controller;

import com.project.dishly.dto.request.RecipeRequest;
import com.project.dishly.dto.request.UpdateRecipeRequest;
import com.project.dishly.dto.request.RatingRequest;
import com.project.dishly.dto.response.RecipeResponse;
import com.project.dishly.dto.response.RecipeListResponse;
import com.project.dishly.dto.response.MessageResponse;
import com.project.dishly.service.RecipeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for recipe endpoints.
 * Handles CRUD operations and recipe management.
 */
@RestController
@RequestMapping("/api/recipes")
@Tag(name = "Recipes", description = "Recipe CRUD operations, search, and management")
public class RecipeController {
    
    @Autowired
    private RecipeService recipeService;
    
    /**
     * Create a new recipe.
     * POST /api/recipes
     *
     * @param recipeRequest the recipe data
     * @param authentication Spring Security authentication object
     * @return RecipeResponse with created recipe
     */
    @PostMapping
    @Operation(
            summary = "Create a new recipe",
            description = "Create a new recipe with ingredients and instructions",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Recipe created successfully",
                            content = @Content(schema = @Schema(implementation = RecipeResponse.class))),
                    @ApiResponse(responseCode = "400", description = "Invalid recipe data"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized")
            }
    )
    public ResponseEntity<RecipeResponse> createRecipe(
            @Valid @RequestBody RecipeRequest recipeRequest,
            Authentication authentication) {
        
        String userEmail = extractEmailFromAuth(authentication);
        RecipeResponse recipeResponse = recipeService.createRecipe(recipeRequest, userEmail);
        return new ResponseEntity<>(recipeResponse, HttpStatus.CREATED);
    }
    
    /**
     * Get user's recipes with optional filtering.
     * GET /api/recipes?search=&category=&tag=&sort=
     *
     * @param authentication Spring Security authentication object
     * @param search optional search term for title
     * @param category optional category filter
     * @param tag optional tag filter
     * @param sort optional sort parameter
     * @return list of RecipeListResponse
     */
    @GetMapping
    @Operation(
            summary = "Get user recipes",
            description = "Retrieve all recipes created by the authenticated user with optional search and filtering",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Recipes retrieved successfully",
                            content = @Content(schema = @Schema(implementation = RecipeListResponse.class))),
                    @ApiResponse(responseCode = "401", description = "Unauthorized")
            }
    )
    public ResponseEntity<List<RecipeListResponse>> getUserRecipes(
            Authentication authentication,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String sort) {
        
        String userEmail = extractEmailFromAuth(authentication);
        List<RecipeListResponse> recipes = recipeService.getUserRecipes(userEmail, search, category, tag, sort);
        
        return ResponseEntity.ok(recipes);
    }
    
    /**
     * Get public recipes with optional filtering and pagination.
     * GET /api/recipes/public?search=&category=&page=0&size=20
     *
     * @param search optional search term for title
     * @param category optional category filter
     * @param page page number (default 0)
     * @param size page size (default 20)
     * @return Page of RecipeListResponse
     */
    @GetMapping("/public")
    @Operation(
            summary = "Get public recipes",
            description = "Retrieve all public recipes with optional search, filtering, and pagination",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Public recipes retrieved successfully",
                            content = @Content(schema = @Schema(implementation = RecipeListResponse.class))),
            }
    )
    public ResponseEntity<Page<RecipeListResponse>> getPublicRecipes(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<RecipeListResponse> recipes = recipeService.getPublicRecipes(search, category, pageable);
        
        return ResponseEntity.ok(recipes);
    }
    
    /**
     * Search public recipes by multiple fields (title, description, tags, username).
     * GET /api/recipes/search?q=&category=&page=0&size=20
     *
     * @param q search term (searches title, description, tags, username)
     * @param category optional category filter
     * @param page page number (default 0)
     * @param size page size (default 20)
     * @return Page of RecipeListResponse
     */
    @GetMapping("/search")
    @Operation(
            summary = "Search public recipes",
            description = "Search public recipes across multiple fields (title, description, tags, username)",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Recipes retrieved successfully",
                            content = @Content(schema = @Schema(implementation = RecipeListResponse.class))),
            }
    )
    public ResponseEntity<Page<RecipeListResponse>> searchPublicRecipes(
            @RequestParam(name = "q", required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<RecipeListResponse> recipes = recipeService.searchPublicRecipes(q, category, pageable);
        
        return ResponseEntity.ok(recipes);
    }
    
    /**
     * Get a specific recipe by ID.
     * GET /api/recipes/{id}
     *
     * @param id the recipe ID
     * @param authentication Spring Security authentication object (may be null for public recipes)
     * @return RecipeResponse with recipe details
     */
    @GetMapping("/{id}")
    @Operation(
            summary = "Get recipe details",
            description = "Retrieve detailed information about a specific recipe by ID",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Recipe retrieved successfully",
                            content = @Content(schema = @Schema(implementation = RecipeResponse.class))),
                    @ApiResponse(responseCode = "404", description = "Recipe not found")
            }
    )
    public ResponseEntity<RecipeResponse> getRecipe(
            @PathVariable String id,
            Authentication authentication) {
        
        String userEmail = authentication != null ? extractEmailFromAuth(authentication) : null;
        RecipeResponse recipeResponse = recipeService.getRecipeById(id, userEmail);
        
        return ResponseEntity.ok(recipeResponse);
    }
    
    /**
     * Update a recipe.
     * PUT /api/recipes/{id}
     *
     * @param id the recipe ID
     * @param updateRequest the partial update data
     * @param authentication Spring Security authentication object
     * @return RecipeResponse with updated recipe
     */
    @PutMapping("/{id}")
    @Operation(
            summary = "Update recipe",
            description = "Update an existing recipe with new information",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Recipe updated successfully",
                            content = @Content(schema = @Schema(implementation = RecipeResponse.class))),
                    @ApiResponse(responseCode = "400", description = "Invalid recipe data"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "404", description = "Recipe not found")
            }
    )
    public ResponseEntity<RecipeResponse> updateRecipe(
            @PathVariable String id,
            @Valid @RequestBody UpdateRecipeRequest updateRequest,
            Authentication authentication) {
        
        String userEmail = extractEmailFromAuth(authentication);
        RecipeResponse recipeResponse = recipeService.updateRecipe(id, updateRequest, userEmail);
        
        return ResponseEntity.ok(recipeResponse);
    }
    
    /**
     * Delete a recipe.
     * DELETE /api/recipes/{id}
     *
     * @param id the recipe ID
     * @param authentication Spring Security authentication object
     * @return success message
     */
    @DeleteMapping("/{id}")
    @Operation(
            summary = "Delete recipe",
            description = "Delete a recipe. Only the recipe owner can delete it",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Recipe deleted successfully",
                            content = @Content(schema = @Schema(implementation = MessageResponse.class))),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "404", description = "Recipe not found")
            }
    )
    public ResponseEntity<MessageResponse> deleteRecipe(
            @PathVariable String id,
            Authentication authentication) {
        
        String userEmail = extractEmailFromAuth(authentication);
        recipeService.deleteRecipe(id, userEmail);
        
        return ResponseEntity.ok(new MessageResponse("Recipe deleted successfully"));
    }
    
    /**
     * Toggle recipe visibility (public/private).
     * PATCH /api/recipes/{id}/visibility
     *
     * @param id the recipe ID
     * @param authentication Spring Security authentication object
     * @return RecipeResponse with updated visibility
     */
    @PatchMapping("/{id}/visibility")
    @Operation(
            summary = "Toggle recipe visibility",
            description = "Toggle a recipe between public and private visibility",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Recipe visibility toggled successfully",
                            content = @Content(schema = @Schema(implementation = RecipeResponse.class))),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "404", description = "Recipe not found")
            }
    )
    public ResponseEntity<RecipeResponse> toggleVisibility(
            @PathVariable String id,
            Authentication authentication) {
        
        String userEmail = extractEmailFromAuth(authentication);
        RecipeResponse recipeResponse = recipeService.toggleVisibility(id, userEmail);
        
        return ResponseEntity.ok(recipeResponse);
    }
    
    /**
     * Rate a recipe.
     * PATCH /api/recipes/{id}/rating
     *
     * @param id the recipe ID
     * @param ratingRequest contains rating value (0-5)
     * @param authentication Spring Security authentication object
     * @return RecipeResponse with updated rating
     */
    @PatchMapping("/{id}/rating")
    @Operation(
            summary = "Rate a recipe",
            description = "Submit or update a rating for a recipe (rating must be between 0 and 5)",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Recipe rated successfully",
                            content = @Content(schema = @Schema(implementation = RecipeResponse.class))),
                    @ApiResponse(responseCode = "400", description = "Invalid rating value"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "404", description = "Recipe not found")
            }
    )
    public ResponseEntity<RecipeResponse> rateRecipe(
            @PathVariable String id,
            @Valid @RequestBody RatingRequest ratingRequest,
            Authentication authentication) {
        
        String userEmail = extractEmailFromAuth(authentication);
        RecipeResponse recipeResponse = recipeService.rateRecipe(id, ratingRequest.getRating(), userEmail);
        
        return ResponseEntity.ok(recipeResponse);
    }
    
    /**
     * Like a recipe.
     * POST /api/recipes/{id}/like
     *
     * @param id the recipe ID
     * @param authentication Spring Security authentication object
     * @return RecipeResponse with updated like status
     */
    @PostMapping("/{id}/like")
    @Operation(
            summary = "Like a recipe",
            description = "Like a recipe",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Recipe liked successfully",
                            content = @Content(schema = @Schema(implementation = RecipeResponse.class))),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "404", description = "Recipe not found")
            }
    )
    public ResponseEntity<RecipeResponse> likeRecipe(
            @PathVariable String id,
            Authentication authentication) {
        
        String userEmail = extractEmailFromAuth(authentication);
        RecipeResponse recipeResponse = recipeService.likeRecipe(id, userEmail);
        
        return ResponseEntity.ok(recipeResponse);
    }
    
    /**
     * Unlike a recipe.
     * DELETE /api/recipes/{id}/like
     *
     * @param id the recipe ID
     * @param authentication Spring Security authentication object
     * @return RecipeResponse with updated like status
     */
    @DeleteMapping("/{id}/like")
    @Operation(
            summary = "Unlike a recipe",
            description = "Unlike a recipe",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Recipe unliked successfully",
                            content = @Content(schema = @Schema(implementation = RecipeResponse.class))),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "404", description = "Recipe not found")
            }
    )
    public ResponseEntity<RecipeResponse> unlikeRecipe(
            @PathVariable String id,
            Authentication authentication) {
        
        String userEmail = extractEmailFromAuth(authentication);
        RecipeResponse recipeResponse = recipeService.unlikeRecipe(id, userEmail);
        
        return ResponseEntity.ok(recipeResponse);
    }
    
    /**
     * Get most liked public recipes.
     * GET /api/recipes/public/trending
     *
     * @return list of most liked recipes
     */
    @GetMapping("/public/trending")
    @Operation(
            summary = "Get trending recipes",
            description = "Get the 3 most liked public recipes",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Recipes retrieved successfully",
                            content = @Content(schema = @Schema(implementation = RecipeListResponse.class)))
            }
    )
    public ResponseEntity<List<RecipeListResponse>> getTrendingRecipes() {
        List<RecipeListResponse> recipes = recipeService.getMostLikedRecipes(3);
        return ResponseEntity.ok(recipes);
    }
    
    /**
     * Copy a public recipe to user's account.
     * POST /api/recipes/{id}/copy
     *
     * @param id the recipe ID to copy
     * @param authentication Spring Security authentication object
     * @return RecipeResponse with newly created recipe
     */
    @PostMapping("/{id}/copy")
    @Operation(
            summary = "Copy public recipe",
            description = "Create a copy of a public recipe for the authenticated user",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Recipe copied successfully",
                            content = @Content(schema = @Schema(implementation = RecipeResponse.class))),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "404", description = "Recipe not found")
            }
    )
    public ResponseEntity<RecipeResponse> copyRecipe(
            @PathVariable String id,
            Authentication authentication) {
        
        String userEmail = extractEmailFromAuth(authentication);
        RecipeResponse recipeResponse = recipeService.copyRecipe(id, userEmail);
        
        return new ResponseEntity<>(recipeResponse, HttpStatus.CREATED);
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
