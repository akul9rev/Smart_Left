# Smart-Left Backend

## Prerequisites
- Java 17 or higher
- Maven 3.6 or higher

## Running the Backend

### Option 1: Using Maven (if installed)
```bash
mvn spring-boot:run
```

### Option 2: Using Maven Wrapper (if available)
```bash
./mvnw spring-boot:run
```

### Option 3: Compile and Run (if Maven not available)
```bash
# Compile the project
javac -cp "target/classes:target/dependency/*" -d target/classes src/main/java/com/smartleft/api/*.java

# Run the application
java -cp "target/classes:target/dependency/*" com.smartleft.api.SmartLeftApplication
```

## Demo Credentials
- Email: `demo@smartleft.com`
- Password: `demo123`

## API Endpoints
- `GET /` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/ingredients` - Get user ingredients
- `POST /api/ingredients` - Add ingredient
- `GET /api/recipes` - Get user recipes
- `POST /api/recipes` - Save recipe
- `POST /api/recipes/suggest` - Get recipe suggestions
- `GET /api/impact` - Get impact data
- `POST /api/impact` - Update impact data

## Database
- H2 Console: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:smartleftdb`
- Username: `sa`
- Password: (empty)

## Troubleshooting
If you get "Maven not found" error:
1. Install Maven from https://maven.apache.org/download.cgi
2. Add Maven to your PATH environment variable
3. Restart your terminal/command prompt
4. Run `mvn spring-boot:run`
