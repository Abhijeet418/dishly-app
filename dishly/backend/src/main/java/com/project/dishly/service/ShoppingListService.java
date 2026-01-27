package com.project.dishly.service;

import com.project.dishly.dto.request.ShoppingListRequest;
import com.project.dishly.dto.response.ShoppingListResponse;
import com.project.dishly.exception.BadRequestException;
import com.project.dishly.exception.ResourceNotFoundException;
import com.project.dishly.exception.UnauthorizedException;
import com.project.dishly.model.Ingredient;
import com.project.dishly.model.Recipe;
import com.project.dishly.model.ShoppingItem;
import com.project.dishly.model.ShoppingList;
import com.project.dishly.repository.RecipeRepository;
import com.project.dishly.repository.ShoppingListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for shopping list management.
 * Handles creation and management of shopping lists with aggregated ingredients.
 */
@Service
public class ShoppingListService {
    
    @Autowired
    private ShoppingListRepository shoppingListRepository;
    
    @Autowired
    private RecipeRepository recipeRepository;
    
    /**
     * Generate a shopping list from selected recipes.
     * Aggregates ingredients from multiple recipes, combining duplicates.
     *
     * @param shoppingListRequest contains list name and recipe IDs
     * @param userId the authenticated user's ID
     * @return ShoppingListResponse with aggregated ingredients
     * @throws BadRequestException if no recipes provided
     * @throws ResourceNotFoundException if any recipe not found
     */
    public ShoppingListResponse generateShoppingList(ShoppingListRequest shoppingListRequest, String userId) {
        if (shoppingListRequest.getRecipeIds() == null || shoppingListRequest.getRecipeIds().isEmpty()) {
            throw new BadRequestException("At least one recipe is required to generate a shopping list");
        }
        
        // Fetch all recipes
        List<Recipe> recipes = new ArrayList<>();
        for (String recipeId : shoppingListRequest.getRecipeIds()) {
            Recipe recipe = recipeRepository.findById(recipeId)
                    .orElseThrow(() -> new ResourceNotFoundException("Recipe not found: " + recipeId));
            recipes.add(recipe);
        }
        
        // Aggregate ingredients from all recipes
        Map<String, ShoppingItem> aggregatedItems = new HashMap<>();
        
        for (Recipe recipe : recipes) {
            if (recipe.getIngredients() != null) {
                for (Ingredient ingredient : recipe.getIngredients()) {
                    String key = ingredient.getName() + "_" + ingredient.getUnit();
                    
                    if (aggregatedItems.containsKey(key)) {
                        // Combine quantities
                        ShoppingItem existingItem = aggregatedItems.get(key);
                        existingItem.setQuantity(existingItem.getQuantity() + ingredient.getQuantity());
                    } else {
                        // Create new item
                        ShoppingItem newItem = new ShoppingItem();
                        newItem.setIngredientName(ingredient.getName());
                        newItem.setQuantity(ingredient.getQuantity());
                        newItem.setUnit(ingredient.getUnit());
                        newItem.setIsChecked(false);
                        aggregatedItems.put(key, newItem);
                    }
                }
            }
        }
        
        // Create shopping list document
        ShoppingList shoppingList = new ShoppingList();
        shoppingList.setUserId(userId);
        shoppingList.setName(shoppingListRequest.getName());
        shoppingList.setItems(new ArrayList<>(aggregatedItems.values()));
        
        ShoppingList savedList = shoppingListRepository.save(shoppingList);
        return mapToShoppingListResponse(savedList);
    }
    
    /**
     * Get all shopping lists for the authenticated user.
     *
     * @param userId the user's ID
     * @return list of ShoppingListResponse
     */
    public List<ShoppingListResponse> getUserShoppingLists(String userId) {
        List<ShoppingList> lists = shoppingListRepository.findByUserId(userId);
        
        return lists.stream()
                .map(this::mapToShoppingListResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Toggle the checked status of a shopping list item.
     * Verifies ownership of the shopping list.
     *
     * @param listId the shopping list ID
     * @param itemIndex the index of the item to toggle
     * @param userId the authenticated user's ID
     * @return ShoppingListResponse with updated list
     * @throws ResourceNotFoundException if list not found
     * @throws UnauthorizedException if user is not the owner
     * @throws BadRequestException if item index is invalid
     */
    public ShoppingListResponse toggleItemChecked(String listId, int itemIndex, String userId) {
        ShoppingList shoppingList = shoppingListRepository.findById(listId)
                .orElseThrow(() -> new ResourceNotFoundException("Shopping list not found"));
        
        if (!shoppingList.getUserId().equals(userId)) {
            throw new UnauthorizedException("You can only modify your own shopping lists");
        }
        
        if (itemIndex < 0 || itemIndex >= shoppingList.getItems().size()) {
            throw new BadRequestException("Invalid item index");
        }
        
        ShoppingItem item = shoppingList.getItems().get(itemIndex);
        item.setIsChecked(!item.getIsChecked());
        
        ShoppingList updatedList = shoppingListRepository.save(shoppingList);
        return mapToShoppingListResponse(updatedList);
    }
    
    /**
     * Delete a shopping list.
     * Verifies ownership before deletion.
     *
     * @param id the shopping list ID
     * @param userId the authenticated user's ID
     * @throws ResourceNotFoundException if list not found
     * @throws UnauthorizedException if user is not the owner
     */
    public void deleteShoppingList(String id, String userId) {
        ShoppingList shoppingList = shoppingListRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shopping list not found"));
        
        if (!shoppingList.getUserId().equals(userId)) {
            throw new UnauthorizedException("You can only delete your own shopping lists");
        }
        
        shoppingListRepository.delete(shoppingList);
    }
    
    /**
     * Map ShoppingList entity to ShoppingListResponse DTO.
     *
     * @param shoppingList the ShoppingList entity
     * @return ShoppingListResponse DTO
     */
    private ShoppingListResponse mapToShoppingListResponse(ShoppingList shoppingList) {
        return new ShoppingListResponse(
                shoppingList.getId(),
                shoppingList.getName(),
                shoppingList.getItems(),
                shoppingList.getCreatedAt()
        );
    }
}
