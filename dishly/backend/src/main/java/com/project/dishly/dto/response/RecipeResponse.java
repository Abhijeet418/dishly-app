package com.project.dishly.dto.response;

import com.project.dishly.model.Ingredient;
import com.project.dishly.model.Instruction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for complete recipe response.
 * Contains full recipe details including ingredients and instructions.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeResponse {
    
    private String id;
    
    private String title;
    
    private String description;
    
    private Integer prepTimeMinutes;
    
    private Integer cookTimeMinutes;
    
    private Integer servings;
    
    private String difficulty;
    
    private Boolean isPublic;
    
    private Double averageRating;
    
    private Integer ratingCount;
    
    private Integer likeCount;
    
    private Boolean isLiked;
    
    private List<String> imageUrls;
    
    private List<Ingredient> ingredients;
    
    private List<Instruction> instructions;
    
    private List<String> categories;
    
    private List<String> tags;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // User information
    private String userId;
    
    private String username;
}
