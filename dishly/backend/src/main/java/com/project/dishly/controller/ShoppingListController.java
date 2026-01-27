package com.project.dishly.controller;

import com.project.dishly.dto.request.ShoppingListRequest;
import com.project.dishly.dto.response.ShoppingListResponse;
import com.project.dishly.dto.response.MessageResponse;
import com.project.dishly.service.ShoppingListService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for shopping list endpoints.
 * Handles creation and management of shopping lists with aggregated ingredients.
 */
@RestController
@RequestMapping("/api/shopping-lists")
@Tag(name = "Shopping Lists", description = "Manage shopping lists and aggregated ingredient lists")
public class ShoppingListController {
    
    @Autowired
    private ShoppingListService shoppingListService;
    
    /**
     * Generate a new shopping list from selected recipes.
     * POST /api/shopping-lists/generate
     *
     * @param shoppingListRequest contains list name and recipe IDs
     * @param authentication Spring Security authentication object
     * @return ShoppingListResponse with aggregated ingredients
     */
    @PostMapping("/generate")
    @Operation(
            summary = "Generate shopping list",
            description = "Generate a shopping list from selected recipes with aggregated ingredients",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Shopping list generated successfully",
                            content = @Content(schema = @Schema(implementation = ShoppingListResponse.class))),
                    @ApiResponse(responseCode = "400", description = "Invalid shopping list data"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized")
            }
    )
    public ResponseEntity<ShoppingListResponse> generateShoppingList(
            @Valid @RequestBody ShoppingListRequest shoppingListRequest,
            Authentication authentication) {
        
        String userEmail = extractEmailFromAuth(authentication);
        ShoppingListResponse response = shoppingListService.generateShoppingList(shoppingListRequest, userEmail);
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    /**
     * Get all shopping lists for the authenticated user.
     * GET /api/shopping-lists
     *
     * @param authentication Spring Security authentication object
     * @return list of ShoppingListResponse
     */
    @GetMapping
    @Operation(
            summary = "Get user shopping lists",
            description = "Retrieve all shopping lists created by the authenticated user",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Shopping lists retrieved successfully",
                            content = @Content(schema = @Schema(implementation = ShoppingListResponse.class))),
                    @ApiResponse(responseCode = "401", description = "Unauthorized")
            }
    )
    public ResponseEntity<List<ShoppingListResponse>> getUserShoppingLists(Authentication authentication) {
        String userEmail = extractEmailFromAuth(authentication);
        List<ShoppingListResponse> lists = shoppingListService.getUserShoppingLists(userEmail);
        
        return ResponseEntity.ok(lists);
    }
    
    /**
     * Toggle the checked status of a shopping list item.
     * PATCH /api/shopping-lists/{id}/items/{itemIndex}/toggle
     *
     * @param id the shopping list ID
     * @param itemIndex the index of the item to toggle
     * @param authentication Spring Security authentication object
     * @return ShoppingListResponse with updated list
     */
    @PatchMapping("/{id}/items/{itemIndex}/toggle")
    @Operation(
            summary = "Toggle shopping list item",
            description = "Toggle the checked status of an item in the shopping list",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Item toggled successfully",
                            content = @Content(schema = @Schema(implementation = ShoppingListResponse.class))),
                    @ApiResponse(responseCode = "400", description = "Invalid item index"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "404", description = "Shopping list not found")
            }
    )
    public ResponseEntity<ShoppingListResponse> toggleItemChecked(
            @PathVariable String id,
            @PathVariable int itemIndex,
            Authentication authentication) {
        
        String userEmail = extractEmailFromAuth(authentication);
        ShoppingListResponse response = shoppingListService.toggleItemChecked(id, itemIndex, userEmail);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Delete a shopping list.
     * DELETE /api/shopping-lists/{id}
     *
     * @param id the shopping list ID
     * @param authentication Spring Security authentication object
     * @return success message
     */
    @DeleteMapping("/{id}")
    @Operation(
            summary = "Delete shopping list",
            description = "Delete a shopping list. Only the list owner can delete it",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Shopping list deleted successfully",
                            content = @Content(schema = @Schema(implementation = MessageResponse.class))),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "404", description = "Shopping list not found")
            }
    )
    public ResponseEntity<MessageResponse> deleteShoppingList(
            @PathVariable String id,
            Authentication authentication) {
        
        String userEmail = extractEmailFromAuth(authentication);
        shoppingListService.deleteShoppingList(id, userEmail);
        
        return ResponseEntity.ok(new MessageResponse("Shopping list deleted successfully"));
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
