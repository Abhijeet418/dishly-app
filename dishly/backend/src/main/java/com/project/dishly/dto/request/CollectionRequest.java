package com.project.dishly.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for collection creation request.
 * Contains basic information for creating a recipe collection.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollectionRequest {
    
    @NotBlank(message = "Collection name is required")
    private String name;
}
