package com.project.dishly.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for shopping list generation request.
 * Contains selected recipes and list metadata.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShoppingListRequest {
    
    @NotBlank(message = "Shopping list name is required")
    private String name;
    
    @NotNull(message = "Recipe IDs are required")
    private List<String> recipeIds;
}
