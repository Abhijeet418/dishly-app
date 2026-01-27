package com.project.dishly.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for generic message response.
 * Used for simple success messages.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    
    private String message;
}
