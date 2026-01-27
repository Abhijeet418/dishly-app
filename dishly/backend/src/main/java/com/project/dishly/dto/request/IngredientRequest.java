package com.project.dishly.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for ingredient in recipe requests.
 * Represents a single ingredient with quantity and unit.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IngredientRequest {
    
    @NotBlank(message = "Ingredient name is required")
    private String name;
    
    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Double quantity;
    
    @NotBlank(message = "Unit is required")
    private String unit;
    
    @NotNull(message = "Order is required")
    @Min(value = 0, message = "Order cannot be negative")
    private Integer order;
}
