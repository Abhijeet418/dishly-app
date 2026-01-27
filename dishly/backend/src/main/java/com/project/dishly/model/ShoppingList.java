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
 * ShoppingList entity representing a user's shopping list.
 * Contains aggregated ingredients from selected recipes with tracking of purchased items.
 */
@Document(collection = "shopping_lists")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShoppingList {
    
    @Id
    private String id;
    
    @Indexed
    private String userId;
    
    private String name;
    
    private List<ShoppingItem> items;
    
    @CreatedDate
    private LocalDateTime createdAt;
}
