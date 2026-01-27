package com.project.dishly.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Embedded document for shopping list items.
 * Part of the ShoppingList document.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShoppingItem {
    
    private String ingredientName;
    
    private Double quantity;
    
    private String unit;
    
    private Boolean isChecked = false;
}
