# Smart-Left 🍽️

An AI-powered food assistant that helps you cook smarter, waste less, and save money by suggesting recipes based on your available ingredients.

## ✨ Features

- **🧠 AI-Powered Recipe Suggestions** - Get personalized recipes based on your ingredients
- **📱 Multiple Input Methods** - Add ingredients via text, voice, or camera
- **📊 Impact Tracking** - Monitor money saved, waste prevented, and recipes created
- **🌙 Dark Mode** - Beautiful dark/light theme toggle
- **👤 User Authentication** - Secure login with JWT tokens
- **📱 Responsive Design** - Works perfectly on desktop and mobile
- **🎤 Voice Input** - Use Web Speech API to add ingredients by voice
- **📸 Camera Scanning** - Mock AI food detection from photos

## 🚀 Quick Start

### Frontend (Works Offline)
1. Open `frontend/index.html` in your browser
2. Click "Get Started" → "Use Demo" for offline testing
3. Start adding ingredients and generating recipes!

### Backend (Optional)
1. **Prerequisites:**
   - Java 17+
   - Maven 3.6+

2. **Run Backend:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

3. **Access:**
   - API: http://localhost:8080
   - H2 Console: http://localhost:8080/h2-console
   - Demo Login: `demo@smartleft.com` / `demo123`

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Bootstrap 5
- **Vanilla JavaScript** - No frameworks, pure JS
- **Web APIs** - Speech Recognition, Camera, Local Storage

### Backend
- **Java 17** - Modern Java features
- **Spring Boot 3.2** - Rapid development framework
- **Spring Security** - JWT authentication
- **Spring Data JPA** - Database operations
- **H2 Database** - In-memory database for development

## 📁 Project Structure

```
Smart_Left/
├── frontend/                 # Frontend application
│   ├── index.html           # Main HTML file
│   ├── styles.css           # Custom CSS styles
│   ├── app.js               # JavaScript application logic
│   └── .gitignore           # Frontend gitignore
├── backend/                  # Backend application
│   ├── src/main/java/       # Java source code
│   │   └── com/smartleft/api/
│   │       ├── controller/   # REST controllers
│   │       ├── model/        # JPA entities
│   │       ├── repository/   # Data repositories
│   │       ├── service/      # Business logic
│   │       ├── security/     # Security configuration
│   │       └── dto/          # Data transfer objects
│   ├── src/main/resources/   # Configuration files
│   ├── pom.xml              # Maven dependencies
│   └── .gitignore           # Backend gitignore
└── README.md                # This file
```

## 🎯 Usage

### Adding Ingredients
- **Text Input**: Type ingredient name, select category, set expiry date
- **Voice Input**: Click microphone, speak ingredient names
- **Camera**: Take photo, AI detects food items automatically

### Recipe Generation
- Set preferences (cooking time, skill level, equipment)
- Click "Generate Recipes" to get AI suggestions
- Save recipes and track your impact

### Impact Tracking
- **Money Saved**: Track cost savings from using leftovers
- **Waste Prevented**: Monitor food waste reduction
- **Recipes Created**: Count of recipes you've made

## 🔧 Development

### Frontend Development
- No build process required
- Edit HTML, CSS, JS directly
- Test in browser immediately

### Backend Development
- Uses Maven for dependency management
- Hot reload with Spring Boot DevTools
- H2 console for database inspection

### API Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/ingredients` - Get user ingredients
- `POST /api/ingredients` - Add ingredient
- `POST /api/recipes/suggest` - Get recipe suggestions
- `GET /api/impact` - Get impact data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Bootstrap for the beautiful UI components
- Spring Boot for the robust backend framework
- Web APIs for modern browser features

---

**Made with ❤️ for reducing food waste and promoting sustainable cooking**