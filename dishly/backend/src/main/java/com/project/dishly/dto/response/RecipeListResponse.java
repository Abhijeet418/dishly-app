package com.project.dishly.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for simplified recipe list response.
 * Contains basic recipe information for list views.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeListResponse {
    
    private String id;
    
    private String title;
    
    private List<String> imageUrls;
    
    private Integer prepTimeMinutes;
    
    private Integer cookTimeMinutes;
    
    private Double averageRating;
    
    private Integer ratingCount;
    
    private Integer likeCount;
    
    private Boolean isLiked;
    
    private List<String> categories;
    
    private String difficulty;
    
    private Integer servings;
    
    private String username;
}
