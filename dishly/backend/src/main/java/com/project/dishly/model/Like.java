package com.project.dishly.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Like entity representing a user's like for a recipe.
 * Stores user likes and allows like count calculation.
 */
@Document(collection = "likes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Like {
    
    @Id
    private String id;
    
    @Indexed
    private String recipeId;
    
    @Indexed
    private String userId;
    
    private String username;
    
    @CreatedDate
    private LocalDateTime createdAt;
}
