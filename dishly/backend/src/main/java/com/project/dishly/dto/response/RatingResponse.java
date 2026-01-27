package com.project.dishly.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for rating response.
 * Contains rating details including user information.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingResponse {
    
    private String id;
    
    private String recipeId;
    
    private String userId;
    
    private String username;
    
    private Double rating;
    
    private String review;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
