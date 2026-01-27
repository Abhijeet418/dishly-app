# Dishly Recipe Manager - Spring Boot Backend

A complete REST API backend for a Recipe Manager application built with Spring Boot 3.2+, MongoDB Atlas, and JWT authentication.

## Prerequisites

- Java 17 or higher
- Maven 3.8+
- MongoDB Atlas account and cluster
- An IDE (VS Code, IntelliJ IDEA, etc.)

## Project Structure

```
com.project.dishly/
├── config/              # Configuration classes
│   ├── SecurityConfig.java
│   ├── CorsConfig.java
│   └── MongoConfig.java
├── controller/          # REST API endpoints
│   ├── AuthController.java
│   ├── RecipeController.java
│   ├── CollectionController.java
│   └── ShoppingListController.java
├── dto/                 # Data Transfer Objects
│   ├── request/         # Request DTOs with validation
│   └── response/        # Response DTOs
├── exception/           # Custom exceptions and global handler
├── model/               # MongoDB document entities
├── repository/          # Data access layer
├── security/            # JWT and authentication
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   └── UserDetailsServiceImpl.java
├── service/             # Business logic layer
│   ├── AuthService.java
│   ├── RecipeService.java
│   ├── CollectionService.java
│   └── ShoppingListService.java
└── RecipeManagerApplication.java
```

## Setup Instructions

### 1. Clone the Repository

```bash
cd d:\Projects\Recipe\backend
```

### 2. Configure Environment Variables

Create a `.env` file or set environment variables:

```properties
MONGO_USER=your_mongodb_username
MONGO_PASSWORD=your_mongodb_password
JWT_SECRET=your-secret-key-should-be-at-least-256-bits-long-for-HS512-algorithm
```

**Important Security Notes:**
- Store the JWT_SECRET in a secure vault (environment variables, AWS Secrets Manager, etc.)
- Never commit `.env` files to version control
- Use a strong, random secret: at least 256 bits for HS512

### 3. Update MongoDB Connection String

In `application.properties`:

```properties
spring.data.mongodb.uri=mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@your-cluster.mongodb.net/recipe_manager?retryWrites=true&w=majority
```

Replace `your-cluster` with your actual MongoDB Atlas cluster name.

### 4. Build the Project

```bash
mvn clean install
```

### 5. Run the Application

```bash
mvn spring-boot:run
```

Or build and run the JAR:

```bash
mvn clean package
java -jar target/dishly-1.0.0.jar
```

The application will start on `http://localhost:8080`

## API Documentation

### Authentication Endpoints

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}

Response:
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-25T10:00:00"
  }
}
```

#### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response: Same as Register
```

#### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer <token>
```

### Recipe Endpoints

#### Create Recipe
```bash
POST /api/recipes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Pasta Carbonara",
  "description": "Classic Italian pasta dish",
  "prepTimeMinutes": 10,
  "cookTimeMinutes": 20,
  "servings": 4,
  "difficulty": "easy",
  "isPublic": true,
  "imageUrls": ["https://example.com/image.jpg"],
  "ingredients": [
    {
      "name": "Pasta",
      "quantity": 400,
      "unit": "g",
      "order": 1
    },
    {
      "name": "Eggs",
      "quantity": 3,
      "unit": "pieces",
      "order": 2
    }
  ],
  "instructions": [
    {
      "stepNumber": 1,
      "description": "Cook pasta in salted water"
    },
    {
      "stepNumber": 2,
      "description": "Mix eggs with cheese"
    }
  ],
  "categories": ["lunch", "dinner"],
  "tags": ["italian", "quick"]
}
```

#### Get User Recipes
```bash
GET /api/recipes
GET /api/recipes?search=pasta
GET /api/recipes?category=dinner
GET /api/recipes?tag=italian
Authorization: Bearer <token>
```

#### Get Public Recipes
```bash
GET /api/recipes/public
GET /api/recipes/public?search=pasta&category=dinner&page=0&size=20
```

#### Get Recipe by ID
```bash
GET /api/recipes/{id}
Authorization: Bearer <token> (optional for public recipes)
```

#### Update Recipe
```bash
PUT /api/recipes/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "servings": 6
}
```

#### Delete Recipe
```bash
DELETE /api/recipes/{id}
Authorization: Bearer <token>
```

#### Toggle Recipe Visibility
```bash
PATCH /api/recipes/{id}/visibility
Authorization: Bearer <token>
```

#### Rate Recipe
```bash
PATCH /api/recipes/{id}/rating
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4.5
}
```

#### Copy Public Recipe
```bash
POST /api/recipes/{id}/copy
Authorization: Bearer <token>
```

### Collection Endpoints

#### Create Collection
```bash
POST /api/collections
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Favorite Breakfasts"
}
```

#### Get User Collections
```bash
GET /api/collections
Authorization: Bearer <token>
```

#### Add Recipe to Collection
```bash
POST /api/collections/{collectionId}/recipes/{recipeId}
Authorization: Bearer <token>
```

#### Remove Recipe from Collection
```bash
DELETE /api/collections/{collectionId}/recipes/{recipeId}
Authorization: Bearer <token>
```

#### Delete Collection
```bash
DELETE /api/collections/{id}
Authorization: Bearer <token>
```

### Shopping List Endpoints

#### Generate Shopping List
```bash
POST /api/shopping-lists/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Weekly Shopping",
  "recipeIds": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
}
```

The system automatically aggregates ingredients from multiple recipes, combining duplicates.

#### Get User Shopping Lists
```bash
GET /api/shopping-lists
Authorization: Bearer <token>
```

#### Toggle Shopping List Item
```bash
PATCH /api/shopping-lists/{id}/items/{itemIndex}/toggle
Authorization: Bearer <token>
```

#### Delete Shopping List
```bash
DELETE /api/shopping-lists/{id}
Authorization: Bearer <token>
```

## Security Features

### JWT Authentication
- Token-based authentication using JJWT library
- Tokens expire after 24 hours (configurable)
- Tokens are validated on each request via Bearer token in Authorization header

### Password Security
- Passwords are hashed using BCrypt
- Never stored as plain text

### Authorization
- User can only access and modify their own recipes, collections, and shopping lists
- Public recipes can be viewed and copied by any user
- Ownership verification on all write operations

### CORS Configuration
- Configured for development environments
- Allowed origins: `http://localhost:3000`, `http://localhost:5173`
- Modify `CorsConfig.java` for production deployment

## Data Models

### User
- Email (unique)
- Password hash
- Name
- Created/Updated timestamps

### Recipe
- User ID (indexed for queries)
- Title (text indexed for search)
- Description
- Cooking times (prep, cook)
- Servings
- Difficulty (enum: easy, medium, hard)
- Public/Private flag
- Rating (0-5)
- Images (URLs)
- Ingredients (embedded)
- Instructions (embedded)
- Categories (breakfast, lunch, dinner, dessert, snacks)
- Tags
- Created/Updated timestamps

### RecipeCollection
- User ID (indexed)
- Name
- Recipe IDs (array)
- Created timestamp

### ShoppingList
- User ID (indexed)
- Name
- Items (embedded with quantity and checked status)
- Created timestamp

## Error Handling

All endpoints return standardized error responses:

```json
{
  "timestamp": "2024-01-25T10:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Email already registered",
  "path": "/api/auth/register"
}
```

### HTTP Status Codes
- `200 OK`: Successful GET/PATCH/DELETE
- `201 Created`: Successful POST
- `400 Bad Request`: Invalid input or validation error
- `401 Unauthorized`: Missing or invalid authentication
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Input Validation

All request DTOs include validation annotations:
- Email format validation
- Required field validation
- Min/Max value validation
- Custom validation messages

Example validation errors:
```json
{
  "timestamp": "2024-01-25T10:00:00",
  "status": 400,
  "error": "Validation Failed",
  "errors": {
    "email": "Email should be valid",
    "password": "Password must be at least 6 characters"
  },
  "path": "/api/auth/register"
}
```

## MongoDB Indexing

Automatic index creation is enabled. The following indexes are created:
- Unique index on `users.email`
- Index on `recipes.userId` for efficient user recipe queries
- Text index on `recipes.title` for full-text search
- Indexes on category/tag fields for filtering

## Development Tips

### Testing with cURL

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get current user
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer <your_token_here>"

# Create recipe
curl -X POST http://localhost:8080/api/recipes \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d @recipe.json
```

### Using Postman

1. Import the API endpoints
2. Set JWT token in the request headers or use Postman's Bearer token feature
3. Use environment variables for base URL and token

### Debugging

- Check MongoDB logs for connection issues
- Enable Spring debug logging: `logging.level.root=DEBUG`
- Verify JWT_SECRET is properly set
- Check firewall for MongoDB Atlas connection

## Deployment

### Production Checklist

1. **Environment Variables**
   - Set all required environment variables securely
   - Use strong JWT secret
   - Use production MongoDB Atlas connection

2. **CORS Configuration**
   - Update `CorsConfig.java` with production domain
   - Remove development localhost URLs

3. **Security Headers**
   - Configure HTTPS
   - Add security headers (HSTS, X-Frame-Options, etc.)

4. **Database**
   - Enable MongoDB authentication
   - Use SSL/TLS for connections
   - Regular backups

5. **Logging**
   - Configure structured logging
   - Monitor application logs
   - Set up alerts

### Docker Deployment

```dockerfile
FROM openjdk:17-jdk-slim

COPY target/dishly-1.0.0.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
```

```bash
docker build -t dishly-api .
docker run -e MONGO_USER=user -e MONGO_PASSWORD=pwd -e JWT_SECRET=secret -p 8080:8080 dishly-api
```

## Contributing

Follow these guidelines:
- Use meaningful commit messages
- Follow Spring Boot conventions
- Add tests for new features
- Update documentation

## License

MIT License

## Support

For issues and questions:
1. Check the documentation
2. Review error messages
3. Check MongoDB Atlas connectivity
4. Verify environment variables

## Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [JWT Introduction](https://jwt.io/)
- [Spring Security Guide](https://spring.io/projects/spring-security)
