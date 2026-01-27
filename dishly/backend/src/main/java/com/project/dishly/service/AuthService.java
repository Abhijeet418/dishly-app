package com.project.dishly.service;

import com.project.dishly.dto.request.LoginRequest;
import com.project.dishly.dto.request.RegisterRequest;
import com.project.dishly.dto.response.AuthResponse;
import com.project.dishly.dto.response.UserResponse;
import com.project.dishly.exception.BadRequestException;
import com.project.dishly.exception.ResourceNotFoundException;
import com.project.dishly.model.User;
import com.project.dishly.repository.UserRepository;
import com.project.dishly.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service for authentication and user management.
 * Handles user registration, login, and user info retrieval.
 */
@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    /**
     * Register a new user.
     * Validates email doesn't already exist, hashes password, saves user, and returns JWT token.
     *
     * @param registerRequest contains email, password, and name
     * @return AuthResponse with JWT token and user info
     * @throws BadRequestException if email already exists
     */
    public AuthResponse register(RegisterRequest registerRequest) {
        // Check if email already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        
        // Create new user
        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setUsername(registerRequest.getUsername());
        user.setName(registerRequest.getName());
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));
        
        // Save user
        User savedUser = userRepository.save(user);
        
        // Generate JWT token
        String token = jwtTokenProvider.generateToken(savedUser.getEmail());
        
        // Return auth response
        UserResponse userResponse = mapToUserResponse(savedUser);
        return new AuthResponse(token, userResponse);
    }
    
    /**
     * Authenticate user and return JWT token.
     * Validates credentials and generates JWT token.
     * Supports login with either email or username.
     *
     * @param loginRequest contains emailOrUsername and password
     * @return AuthResponse with JWT token and user info
     * @throws BadRequestException if credentials are invalid
     */
    public AuthResponse login(LoginRequest loginRequest) {
        try {
            // Find user by email or username
            User user = userRepository.findByEmail(loginRequest.getEmailOrUsername())
                    .orElseGet(() -> userRepository.findByUsername(loginRequest.getEmailOrUsername())
                            .orElseThrow(() -> new ResourceNotFoundException("User not found")));
            
            // Verify password
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
                throw new BadRequestException("Invalid email/username or password");
            }
            
            // Generate JWT token using email
            String token = jwtTokenProvider.generateToken(user.getEmail());
            
            // Return auth response
            UserResponse userResponse = mapToUserResponse(user);
            return new AuthResponse(token, userResponse);
        } catch (BadRequestException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new BadRequestException("Invalid email/username or password");
        }
    }
    
    /**
     * Get current user details by email.
     *
     * @param email the user email
     * @return UserResponse with user details
     * @throws ResourceNotFoundException if user not found
     */
    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return mapToUserResponse(user);
    }
    
    /**
     * Map User entity to UserResponse DTO.
     *
     * @param user the User entity
     * @return UserResponse DTO
     */
    private UserResponse mapToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getCreatedAt()
        );
    }
}
