package com.project.dishly.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for recipe collection response.
 * Contains collection information with recipe count.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollectionResponse {
    
    private String id;
    
    private String name;
    
    private Integer recipeCount;
    
    private List<String> recipeIds;
    
    private LocalDateTime createdAt;
}
