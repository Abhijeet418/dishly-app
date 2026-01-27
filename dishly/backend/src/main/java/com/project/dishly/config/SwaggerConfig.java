package com.project.dishly.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger/OpenAPI configuration for REST API documentation.
 * Generates interactive API documentation with Swagger UI.
 * 
 * Access Swagger UI at: http://localhost:8080/swagger-ui.html
 * OpenAPI JSON at: http://localhost:8080/v3/api-docs
 */
@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Dishly Recipe Manager API")
                        .description("Complete REST API for Recipe Manager application with MongoDB and JWT authentication")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Recipe Manager Team")
                                .email("support@dishly.com")
                                .url("https://dishly.com"))
                        .license(new License()
                                .name("MIT")
                                .url("https://opensource.org/licenses/MIT")))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter JWT token obtained from login endpoint")))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }
}
