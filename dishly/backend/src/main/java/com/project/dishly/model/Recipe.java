package com.project.dishly.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Recipe entity representing a user's recipe.
 * Contains comprehensive recipe information including ingredients, instructions, and metadata.
 */
@Document(collection = "recipes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Recipe {
    
    @Id
    private String id;
    
    @Indexed
    private String userId;
    
    @Indexed
    private String username;
    
    @TextIndexed
    private String title;
    
    private String description;
    
    private Integer prepTimeMinutes;
    
    private Integer cookTimeMinutes;
    
    private Integer servings;
    
    private DifficultyLevel difficulty;
    
    private Boolean isPublic = false;
    
    private Double averageRating = 0.0;
    
    private Integer ratingCount = 0;
    
    private Integer likeCount = 0;
    
    private List<String> imageUrls;
    
    private List<Ingredient> ingredients;
    
    private List<Instruction> instructions;
    
    private List<String> categories;
    
    private List<String> tags;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
