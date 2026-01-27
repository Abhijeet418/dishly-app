package com.project.dishly.dto.response;

import com.project.dishly.model.ShoppingItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for shopping list response.
 * Contains shopping list with aggregated items.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShoppingListResponse {
    
    private String id;
    
    private String name;
    
    private List<ShoppingItem> items;
    
    private LocalDateTime createdAt;
}
