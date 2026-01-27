package com.project.dishly.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for user response.
 * Contains user profile information without sensitive data.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    
    private String id;
    
    private String email;
    
    private String name;
    
    private LocalDateTime createdAt;
}
