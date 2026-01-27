package com.project.dishly.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for partial recipe updates.
 * All fields are optional to allow partial updates.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRecipeRequest {
    
    private String title;
    
    private String description;
    
    @Min(value = 0, message = "Prep time cannot be negative")
    private Integer prepTimeMinutes;
    
    @Min(value = 0, message = "Cook time cannot be negative")
    private Integer cookTimeMinutes;
    
    @Min(value = 1, message = "Servings must be at least 1")
    private Integer servings;
    
    private String difficulty;
    
    private Boolean isPublic;
    
    private List<String> imageUrls;
    
    @Valid
    private List<IngredientRequest> ingredients;
    
    @Valid
    private List<InstructionRequest> instructions;
    
    private List<String> categories;
    
    private List<String> tags;
}
