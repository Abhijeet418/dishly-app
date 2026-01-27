package com.project.dishly.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

/**
 * RecipeCollection entity representing a user's custom collection of recipes.
 * Allows users to organize and group recipes together.
 */
@Document(collection = "collections")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeCollection {
    
    @Id
    private String id;
    
    @Indexed
    private String userId;
    
    private String name;
    
    private List<String> recipeIds;
    
    @CreatedDate
    private LocalDateTime createdAt;
}
