package com.project.dishly.controller;

import com.project.dishly.dto.request.LoginRequest;
import com.project.dishly.dto.request.RegisterRequest;
import com.project.dishly.dto.response.AuthResponse;
import com.project.dishly.dto.response.UserResponse;
import com.project.dishly.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for authentication endpoints.
 * Handles user registration, login, and profile retrieval.
 */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User registration, login, and profile management")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    /**
     * Register a new user.
     * POST /api/auth/register
     *
     * @param registerRequest contains email, password, and name
     * @return AuthResponse with JWT token and user info
     */
    @PostMapping("/register")
    @Operation(
            summary = "Register a new user",
            description = "Create a new user account and receive a JWT token for authentication",
            responses = {
                    @ApiResponse(responseCode = "201", description = "User registered successfully",
                            content = @Content(schema = @Schema(implementation = AuthResponse.class))),
                    @ApiResponse(responseCode = "400", description = "Invalid input or email already exists")
            }
    )
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        AuthResponse authResponse = authService.register(registerRequest);
        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }
    
    /**
     * Authenticate user and return JWT token.
     * POST /api/auth/login
     *
     * @param loginRequest contains email and password
     * @return AuthResponse with JWT token and user info
     */
    @PostMapping("/login")
    @Operation(
            summary = "Login user",
            description = "Authenticate user with email and password, returns JWT token",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Login successful",
                            content = @Content(schema = @Schema(implementation = AuthResponse.class))),
                    @ApiResponse(responseCode = "400", description = "Invalid email or password")
            }
    )
    public ResponseEntity<AuthResponse> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = authService.login(loginRequest);
        return ResponseEntity.ok(authResponse);
    }
    
    /**
     * Get current authenticated user details.
     * GET /api/auth/me
     *
     * @param authentication Spring Security authentication object
     * @return UserResponse with current user details
     */
    @GetMapping("/me")
    @Operation(
            summary = "Get current user",
            description = "Retrieve current authenticated user's profile information",
            responses = {
                    @ApiResponse(responseCode = "200", description = "User details retrieved",
                            content = @Content(schema = @Schema(implementation = UserResponse.class))),
                    @ApiResponse(responseCode = "401", description = "Unauthorized - invalid or missing token")
            }
    )
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String email = userDetails.getUsername();
        
        UserResponse userResponse = authService.getCurrentUser(email);
        return ResponseEntity.ok(userResponse);
    }
}
