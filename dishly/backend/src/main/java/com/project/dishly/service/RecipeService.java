package com.project.dishly.service;

import com.project.dishly.dto.request.RecipeRequest;
import com.project.dishly.dto.request.UpdateRecipeRequest;
import com.project.dishly.dto.request.IngredientRequest;
import com.project.dishly.dto.request.InstructionRequest;
import com.project.dishly.dto.response.RecipeResponse;
import com.project.dishly.dto.response.RecipeListResponse;
import com.project.dishly.exception.ResourceNotFoundException;
import com.project.dishly.exception.UnauthorizedException;
import com.project.dishly.model.Recipe;
import com.project.dishly.model.Rating;
import com.project.dishly.model.Like;
import com.project.dishly.model.User;
import com.project.dishly.model.DifficultyLevel;
import com.project.dishly.model.Ingredient;
import com.project.dishly.model.Instruction;
import com.project.dishly.repository.RecipeRepository;
import com.project.dishly.repository.RatingRepository;
import com.project.dishly.repository.LikeRepository;
import com.project.dishly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for recipe management.
 * Handles creation, retrieval, updating, and deletion of recipes.
 */
@Service
public class RecipeService {
    
    @Autowired
    private RecipeRepository recipeRepository;
    
    @Autowired
    private RatingRepository ratingRepository;
    
    @Autowired
    private LikeRepository likeRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Create a new recipe for the authenticated user.
     *
     * @param recipeRequest the recipe data
     * @param userEmail the authenticated user's email
     * @return RecipeResponse with created recipe details
     */
    public RecipeResponse createRecipe(RecipeRequest recipeRequest, String userEmail) {
        // Get user to retrieve username
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Recipe recipe = new Recipe();
        recipe.setUserId(userEmail);
        recipe.setUsername(user.getUsername());
        recipe.setTitle(recipeRequest.getTitle());
        recipe.setDescription(recipeRequest.getDescription());
        recipe.setPrepTimeMinutes(recipeRequest.getPrepTimeMinutes());
        recipe.setCookTimeMinutes(recipeRequest.getCookTimeMinutes());
        recipe.setServings(recipeRequest.getServings());
        recipe.setDifficulty(DifficultyLevel.valueOf(recipeRequest.getDifficulty().toUpperCase()));
        recipe.setIsPublic(recipeRequest.getIsPublic() != null ? recipeRequest.getIsPublic() : false);
        recipe.setImageUrls(recipeRequest.getImageUrls());
        recipe.setIngredients(mapIngredients(recipeRequest.getIngredients()));
        recipe.setInstructions(mapInstructions(recipeRequest.getInstructions()));
        recipe.setCategories(recipeRequest.getCategories());
        recipe.setTags(recipeRequest.getTags());
        
        Recipe savedRecipe = recipeRepository.save(recipe);
        return mapToRecipeResponse(savedRecipe, true);
    }
    
    /**
     * Get a recipe by ID.
     * Verifies ownership or public status before returning.
     *
     * @param id the recipe ID
     * @param userId the authenticated user's ID (null if public viewing)
     * @return RecipeResponse with recipe details
     * @throws ResourceNotFoundException if recipe not found
     * @throws UnauthorizedException if user doesn't have access
     */
    public RecipeResponse getRecipeById(String id, String userId) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found"));
        
        // Check authorization: owner can always view, others only if public
        boolean isOwner = userId != null && recipe.getUserId().equals(userId);
        if (!isOwner && !recipe.getIsPublic()) {
            throw new UnauthorizedException("You don't have permission to view this recipe");
        }
        
        return mapToRecipeResponse(recipe, isOwner, userId);
    }
    
    /**
     * Get all recipes for a user with optional filtering.
     *
     * @param userId the user's ID
     * @param search optional search term for title
     * @param category optional category filter
     * @param tag optional tag filter
     * @param sort optional sort parameter (not yet implemented)
     * @return list of RecipeListResponse
     */
    public List<RecipeListResponse> getUserRecipes(String userId, String search, String category, String tag, String sort) {
        List<Recipe> recipes;
        
        if (search != null && !search.isEmpty()) {
            recipes = recipeRepository.findByUserIdAndTitleContainingIgnoreCase(userId, search);
        } else if (category != null && !category.isEmpty()) {
            recipes = recipeRepository.findByUserIdAndCategoriesContaining(userId, category);
        } else if (tag != null && !tag.isEmpty()) {
            recipes = recipeRepository.findByUserIdAndTagsContaining(userId, tag);
        } else {
            recipes = recipeRepository.findByUserId(userId);
        }
        
        return recipes.stream()
                .map(this::mapToRecipeListResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get public recipes with optional filtering and pagination.
     *
     * @param search optional search term for title
     * @param category optional category filter
     * @param pageable pagination information
     * @return Page of public recipes
     */
    public Page<RecipeListResponse> getPublicRecipes(String search, String category, Pageable pageable) {
        Page<Recipe> recipePage;
        
        if ((search != null && !search.isEmpty()) && (category != null && !category.isEmpty())) {
            // Both search and category provided
            recipePage = recipeRepository.findByIsPublicTrueAndTitleContainingIgnoreCaseAndCategoriesContainingIgnoreCase(search, category, pageable);
        } else if (search != null && !search.isEmpty()) {
            // Only search provided
            recipePage = recipeRepository.findByIsPublicTrueAndTitleContainingIgnoreCase(search, pageable);
        } else if (category != null && !category.isEmpty()) {
            // Only category provided - use case-insensitive search
            recipePage = recipeRepository.findByIsPublicTrueAndCategoriesContainingIgnoreCase(category, pageable);
        } else {
            // No filters
            recipePage = recipeRepository.findByIsPublicTrue(pageable);
        }
        
        return recipePage.map(this::mapToRecipeListResponse);
    }
    
    /**
     * Search public recipes by multiple fields.
     *
     * @param searchTerm the search term (searches title, description, tags, username)
     * @param category optional category filter
     * @param pageable pagination information
     * @return Page of recipes matching the search
     */
    public Page<RecipeListResponse> searchPublicRecipes(String searchTerm, String category, Pageable pageable) {
        Page<Recipe> recipePage;
        
        if ((searchTerm != null && !searchTerm.isEmpty()) && (category != null && !category.isEmpty())) {
            // For advanced search with both term and category
            recipePage = recipeRepository.findByIsPublicTrueAndTitleContainingIgnoreCaseAndCategoriesContainingIgnoreCase(searchTerm, category, pageable);
        } else if (searchTerm != null && !searchTerm.isEmpty()) {
            // Search across multiple fields - try text search first, fallback to title
            try {
                recipePage = recipeRepository.searchPublicRecipes(searchTerm, pageable);
            } catch (Exception e) {
                // Fallback if text search fails
                recipePage = recipeRepository.findByIsPublicTrueAndTitleContainingIgnoreCase(searchTerm, pageable);
            }
        } else if (category != null && !category.isEmpty()) {
            // Category filter only
            recipePage = recipeRepository.findByIsPublicTrueAndCategoriesContainingIgnoreCase(category, pageable);
        } else {
            // No filters
            recipePage = recipeRepository.findByIsPublicTrue(pageable);
        }
        
        return recipePage.map(this::mapToRecipeListResponse);
    }
    
    /**
     * Separate method to handle Page<Recipe> to pageable conversion.
     * This is a workaround since we need to add findByIsPublicTrue(Pageable) to repository.
     */
    public Page<RecipeListResponse> getPublicRecipesDefault(Pageable pageable) {
        return recipeRepository.findByIsPublicTrue(pageable)
                .map(this::mapToRecipeListResponse);
    }
    
    /**
     * Update an existing recipe.
     * Verifies ownership before allowing update.
     *
     * @param id the recipe ID
     * @param updateRequest the partial update data
     * @param userId the authenticated user's ID
     * @return RecipeResponse with updated recipe
     * @throws ResourceNotFoundException if recipe not found
     * @throws UnauthorizedException if user is not the owner
     */
    public RecipeResponse updateRecipe(String id, UpdateRecipeRequest updateRequest, String userId) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found"));
        
        if (!recipe.getUserId().equals(userId)) {
            throw new UnauthorizedException("You can only update your own recipes");
        }
        
        // Update only provided fields
        if (updateRequest.getTitle() != null) {
            recipe.setTitle(updateRequest.getTitle());
        }
        if (updateRequest.getDescription() != null) {
            recipe.setDescription(updateRequest.getDescription());
        }
        if (updateRequest.getPrepTimeMinutes() != null) {
            recipe.setPrepTimeMinutes(updateRequest.getPrepTimeMinutes());
        }
        if (updateRequest.getCookTimeMinutes() != null) {
            recipe.setCookTimeMinutes(updateRequest.getCookTimeMinutes());
        }
        if (updateRequest.getServings() != null) {
            recipe.setServings(updateRequest.getServings());
        }
        if (updateRequest.getDifficulty() != null) {
            recipe.setDifficulty(DifficultyLevel.valueOf(updateRequest.getDifficulty().toUpperCase()));
        }
        if (updateRequest.getIsPublic() != null) {
            recipe.setIsPublic(updateRequest.getIsPublic());
        }
        if (updateRequest.getImageUrls() != null) {
            recipe.setImageUrls(updateRequest.getImageUrls());
        }
        if (updateRequest.getIngredients() != null) {
            recipe.setIngredients(mapIngredients(updateRequest.getIngredients()));
        }
        if (updateRequest.getInstructions() != null) {
            recipe.setInstructions(mapInstructions(updateRequest.getInstructions()));
        }
        if (updateRequest.getCategories() != null) {
            recipe.setCategories(updateRequest.getCategories());
        }
        if (updateRequest.getTags() != null) {
            recipe.setTags(updateRequest.getTags());
        }
        
        Recipe updatedRecipe = recipeRepository.save(recipe);
        return mapToRecipeResponse(updatedRecipe, true);
    }
    
    /**
     * Delete a recipe.
     * Verifies ownership before allowing deletion.
     * Also deletes all ratings associated with the recipe.
     *
     * @param id the recipe ID
     * @param userId the authenticated user's ID
     * @throws ResourceNotFoundException if recipe not found
     * @throws UnauthorizedException if user is not the owner
     */
    public void deleteRecipe(String id, String userId) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found"));
        
        if (!recipe.getUserId().equals(userId)) {
            throw new UnauthorizedException("You can only delete your own recipes");
        }
        
        // Delete all ratings for this recipe before deleting recipe
        ratingRepository.deleteByRecipeId(id);
        
        recipeRepository.delete(recipe);
    }
    
    /**
     * Toggle recipe visibility (public/private).
     * Verifies ownership before allowing change.
     *
     * @param id the recipe ID
     * @param userId the authenticated user's ID
     * @return RecipeResponse with updated visibility
     * @throws ResourceNotFoundException if recipe not found
     * @throws UnauthorizedException if user is not the owner
     */
    public RecipeResponse toggleVisibility(String id, String userId) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found"));
        
        if (!recipe.getUserId().equals(userId)) {
            throw new UnauthorizedException("You can only change visibility of your own recipes");
        }
        
        recipe.setIsPublic(!recipe.getIsPublic());
        Recipe updatedRecipe = recipeRepository.save(recipe);
        
        return mapToRecipeResponse(updatedRecipe, true);
    }
    
    /**
     * Rate a recipe by another user.
     * Creates or updates a rating from the user for the recipe.
     *
     * @param id the recipe ID
     * @param rating the rating value (0-5)
     * @param userEmail the authenticated user's email
     * @return RecipeResponse with updated average rating
     * @throws ResourceNotFoundException if recipe not found
     */
    public RecipeResponse rateRecipe(String id, Double rating, String userEmail) {
        // Get user to verify they exist
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found"));
        
        // Prevent users from rating their own recipes
        if (recipe.getUserId().equals(userEmail)) {
            throw new UnauthorizedException("You cannot rate your own recipes");
        }
        
        // Check if user already rated this recipe
        java.util.Optional<Rating> existingRating = ratingRepository.findByRecipeIdAndUserId(id, userEmail);
        
        Rating ratingObj;
        if (existingRating.isPresent()) {
            // Update existing rating
            ratingObj = existingRating.get();
            ratingObj.setRating(rating);
        } else {
            // Create new rating
            ratingObj = new Rating();
            ratingObj.setRecipeId(id);
            ratingObj.setUserId(userEmail);
            ratingObj.setUsername(user.getUsername());
            ratingObj.setRating(rating);
        }
        
        ratingRepository.save(ratingObj);
        
        // Recalculate average rating
        recalculateRecipeRating(id);
        
        Recipe updatedRecipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found"));
        
        return mapToRecipeResponse(updatedRecipe, false);
    }
    
    /**
     * Recalculate the average rating for a recipe based on all user ratings.
     *
     * @param recipeId the recipe ID
     */
    private void recalculateRecipeRating(String recipeId) {
        List<Rating> ratings = ratingRepository.findByRecipeId(recipeId);
        
        if (ratings.isEmpty()) {
            // No ratings, reset to 0
            Recipe recipe = recipeRepository.findById(recipeId)
                    .orElseThrow(() -> new ResourceNotFoundException("Recipe not found"));
            recipe.setAverageRating(0.0);
            recipe.setRatingCount(0);
            recipeRepository.save(recipe);
        } else {
            // Calculate average
            double average = ratings.stream()
                    .mapToDouble(Rating::getRating)
                    .average()
                    .orElse(0.0);
            
            Recipe recipe = recipeRepository.findById(recipeId)
                    .orElseThrow(() -> new ResourceNotFoundException("Recipe not found"));
            recipe.setAverageRating(average);
            recipe.setRatingCount(ratings.size());
            recipeRepository.save(recipe);
        }
    }
    
    /**
     * Copy a public recipe to user's account.
     * Creates a new recipe document with copied data.
     *
     * @param id the recipe ID to copy
     * @param userEmail the authenticated user's email
     * @return RecipeResponse with newly created recipe
     * @throws ResourceNotFoundException if recipe not found
     * @throws UnauthorizedException if recipe is not public
     */
    public RecipeResponse copyRecipe(String id, String userEmail) {
        // Get user to retrieve username
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Recipe originalRecipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found"));
        
        if (!originalRecipe.getIsPublic()) {
            throw new UnauthorizedException("You can only copy public recipes");
        }
        
        // Create new recipe with copied data
        Recipe newRecipe = new Recipe();
        newRecipe.setUserId(userEmail);
        newRecipe.setUsername(user.getUsername());
        newRecipe.setTitle(originalRecipe.getTitle());
        newRecipe.setDescription(originalRecipe.getDescription());
        newRecipe.setPrepTimeMinutes(originalRecipe.getPrepTimeMinutes());
        newRecipe.setCookTimeMinutes(originalRecipe.getCookTimeMinutes());
        newRecipe.setServings(originalRecipe.getServings());
        newRecipe.setDifficulty(originalRecipe.getDifficulty());
        newRecipe.setIsPublic(false); // Default to private for copied recipes
        newRecipe.setImageUrls(originalRecipe.getImageUrls());
        newRecipe.setIngredients(originalRecipe.getIngredients());
        newRecipe.setInstructions(originalRecipe.getInstructions());
        newRecipe.setCategories(originalRecipe.getCategories());
        newRecipe.setTags(originalRecipe.getTags());
        
        Recipe savedRecipe = recipeRepository.save(newRecipe);
        return mapToRecipeResponse(savedRecipe, true);
    }
    
    /**
     * Map IngredientRequest DTOs to Ingredient entities.
     *
     * @param ingredientRequests list of ingredient requests
     * @return list of Ingredient entities
     */
    private List<Ingredient> mapIngredients(List<IngredientRequest> ingredientRequests) {
        return ingredientRequests.stream()
                .map(req -> new Ingredient(req.getName(), req.getQuantity(), req.getUnit(), req.getOrder()))
                .collect(Collectors.toList());
    }
    
    /**
     * Map InstructionRequest DTOs to Instruction entities.
     *
     * @param instructionRequests list of instruction requests
     * @return list of Instruction entities
     */
    private List<Instruction> mapInstructions(List<InstructionRequest> instructionRequests) {
        return instructionRequests.stream()
                .map(req -> new Instruction(req.getStepNumber(), req.getDescription()))
                .collect(Collectors.toList());
    }
    
    /**
     * Map Recipe entity to RecipeResponse DTO.
     *
     * @param recipe the Recipe entity
     * @param includeUserId whether to include userId in response
     * @return RecipeResponse DTO
     */
    private RecipeResponse mapToRecipeResponse(Recipe recipe, boolean includeUserId) {
        return mapToRecipeResponse(recipe, includeUserId, null);
    }
    
    /**
     * Like a recipe.
     *
     * @param id the recipe ID
     * @param userEmail the authenticated user's email
     * @return RecipeResponse with updated like status
     */
    public RecipeResponse likeRecipe(String id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found"));
        
        // Check if user already liked this recipe
        java.util.Optional<Like> existingLike = likeRepository.findByRecipeIdAndUserId(id, userEmail);
        
        if (!existingLike.isPresent()) {
            // Create new like
            Like like = new Like();
            like.setRecipeId(id);
            like.setUserId(userEmail);
            like.setUsername(user.getUsername());
            likeRepository.save(like);
            
            // Increment like count
            recipe.setLikeCount((recipe.getLikeCount() != null ? recipe.getLikeCount() : 0) + 1);
            recipeRepository.save(recipe);
        }
        
        Recipe updatedRecipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found"));
        
        return mapToRecipeResponse(updatedRecipe, false, userEmail);
    }
    
    /**
     * Unlike a recipe.
     *
     * @param id the recipe ID
     * @param userEmail the authenticated user's email
     * @return RecipeResponse with updated like status
     */
    public RecipeResponse unlikeRecipe(String id, String userEmail) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found"));
        
        // Check if user liked this recipe
        java.util.Optional<Like> existingLike = likeRepository.findByRecipeIdAndUserId(id, userEmail);
        
        if (existingLike.isPresent()) {
            // Remove like
            likeRepository.deleteByRecipeIdAndUserId(id, userEmail);
            
            // Decrement like count
            recipe.setLikeCount(Math.max(0, (recipe.getLikeCount() != null ? recipe.getLikeCount() : 0) - 1));
            recipeRepository.save(recipe);
        }
        
        Recipe updatedRecipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found"));
        
        return mapToRecipeResponse(updatedRecipe, false, userEmail);
    }
    
    /**
     * Get most liked public recipes.
     *
     * @param limit the number of recipes to return
     * @return list of most liked recipes
     */
    public List<RecipeListResponse> getMostLikedRecipes(int limit) {
        List<Recipe> recipes = recipeRepository.findAll()
                .stream()
                .filter(Recipe::getIsPublic)
                .sorted((r1, r2) -> {
                    int r1Likes = r1.getLikeCount() != null ? r1.getLikeCount() : 0;
                    int r2Likes = r2.getLikeCount() != null ? r2.getLikeCount() : 0;
                    return r2Likes - r1Likes;
                })
                .limit(limit)
                .collect(Collectors.toList());
        
        return recipes.stream()
                .map(recipe -> mapToRecipeListResponse(recipe, null))
                .collect(Collectors.toList());
    }
    
    private RecipeListResponse mapToRecipeListResponse(Recipe recipe, String userEmail) {
        boolean isLiked = false;
        if (userEmail != null) {
            isLiked = likeRepository.findByRecipeIdAndUserId(recipe.getId(), userEmail).isPresent();
        }
        
        return new RecipeListResponse(
                recipe.getId(),
                recipe.getTitle(),
                recipe.getImageUrls(),
                recipe.getPrepTimeMinutes(),
                recipe.getCookTimeMinutes(),
                recipe.getAverageRating(),
                recipe.getRatingCount(),
                recipe.getLikeCount() != null ? recipe.getLikeCount() : 0,
                isLiked,
                recipe.getCategories(),
                recipe.getDifficulty().toString(),
                recipe.getServings(),
                recipe.getUsername()
        );
    }
    
    private RecipeResponse mapToRecipeResponse(Recipe recipe, boolean isOwner, String userEmail) {
        boolean isLiked = false;
        if (userEmail != null) {
            isLiked = likeRepository.findByRecipeIdAndUserId(recipe.getId(), userEmail).isPresent();
        }
        
        RecipeResponse response = new RecipeResponse();
        response.setId(recipe.getId());
        response.setTitle(recipe.getTitle());
        response.setDescription(recipe.getDescription());
        response.setPrepTimeMinutes(recipe.getPrepTimeMinutes());
        response.setCookTimeMinutes(recipe.getCookTimeMinutes());
        response.setServings(recipe.getServings());
        response.setDifficulty(recipe.getDifficulty().toString());
        response.setIsPublic(recipe.getIsPublic());
        response.setAverageRating(recipe.getAverageRating());
        response.setRatingCount(recipe.getRatingCount());
        response.setLikeCount(recipe.getLikeCount() != null ? recipe.getLikeCount() : 0);
        response.setIsLiked(isLiked);
        response.setImageUrls(recipe.getImageUrls());
        response.setIngredients(recipe.getIngredients());
        response.setInstructions(recipe.getInstructions());
        response.setCategories(recipe.getCategories());
        response.setTags(recipe.getTags());
        response.setCreatedAt(recipe.getCreatedAt());
        response.setUpdatedAt(recipe.getUpdatedAt());
        response.setUsername(recipe.getUsername());
        
        if (isOwner) {
            response.setUserId(recipe.getUserId());
        }
        
        return response;
    }

    /**
     * Map Recipe entity to RecipeListResponse DTO.
     *
     * @param recipe the Recipe entity
     * @return RecipeListResponse DTO
     */
    private RecipeListResponse mapToRecipeListResponse(Recipe recipe) {
        return mapToRecipeListResponse(recipe, null);
    }
}
