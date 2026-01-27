# Multi-stage build Dockerfile for Spring Boot 3.x Recipe Manager API
# Stage 1: Build stage
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /build

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:resolve

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Runtime stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the JAR from builder stage
COPY --from=builder /build/target/dishly-1.0.0.jar app.jar

# Expose port (Render will use PORT environment variable)
EXPOSE 8080

# Set environment variables
ENV SPRING_APPLICATION_NAME=dishly
ENV SERVER_PORT=8080

# Run the application
# Render uses PORT environment variable, Spring Boot needs server.port
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]
