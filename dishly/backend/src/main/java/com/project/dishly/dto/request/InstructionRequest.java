package com.project.dishly.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for instruction in recipe requests.
 * Represents a single cooking step.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InstructionRequest {
    
    @NotNull(message = "Step number is required")
    @Min(value = 1, message = "Step number must be at least 1")
    private Integer stepNumber;
    
    @NotBlank(message = "Step description is required")
    private String description;
}
