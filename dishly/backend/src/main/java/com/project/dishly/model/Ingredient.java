package com.project.dishly.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Embedded document for recipe ingredients.
 * Part of the Recipe document.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ingredient {
    
    private String name;
    
    private Double quantity;
    
    private String unit;
    
    private Integer order;
}
