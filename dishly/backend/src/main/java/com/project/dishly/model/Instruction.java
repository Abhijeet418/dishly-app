package com.project.dishly.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Embedded document for recipe cooking instructions.
 * Part of the Recipe document.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Instruction {
    
    private Integer stepNumber;
    
    private String description;
}
