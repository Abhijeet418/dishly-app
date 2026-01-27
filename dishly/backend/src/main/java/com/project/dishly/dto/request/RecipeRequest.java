package com.project.dishly.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for creating a new recipe.
 * Contains all recipe details including ingredients and instructions.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotNull(message = "Prep time is required")
    @Min(value = 0, message = "Prep time cannot be negative")
    private Integer prepTimeMinutes;
    
    @NotNull(message = "Cook time is required")
    @Min(value = 0, message = "Cook time cannot be negative")
    private Integer cookTimeMinutes;
    
    @NotNull(message = "Servings is required")
    @Min(value = 1, message = "Servings must be at least 1")
    private Integer servings;
    
    @NotBlank(message = "Difficulty is required")
    private String difficulty;
    
    private Boolean isPublic = false;
    
    private List<String> imageUrls;
    
    @Valid
    @NotNull(message = "Ingredients are required")
    private List<IngredientRequest> ingredients;
    
    @Valid
    @NotNull(message = "Instructions are required")
    private List<InstructionRequest> instructions;
    
    private List<String> categories;
    
    private List<String> tags;
}
