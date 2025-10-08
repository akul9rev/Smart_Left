# Deployment Guide

## Frontend Deployment

### Option 1: GitHub Pages (Recommended)
1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select source: "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Your app will be available at `https://yourusername.github.io/Smart_Left/frontend/`

### Option 2: Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: (leave empty)
3. Set publish directory: `frontend`
4. Deploy!

### Option 3: Vercel
1. Import your GitHub repository to Vercel
2. Set root directory: `frontend`
3. Deploy!

## Backend Deployment

### Option 1: Heroku
1. Create `Procfile` in backend directory:
   ```
   web: java -jar target/api-0.0.1-SNAPSHOT.jar
   ```
2. Add Heroku Postgres addon
3. Update `application.properties` for production database
4. Deploy!

### Option 2: Railway
1. Connect GitHub repository
2. Set root directory: `backend`
3. Railway will auto-detect Maven and deploy

### Option 3: DigitalOcean App Platform
1. Connect GitHub repository
2. Set source directory: `backend`
3. Set build command: `mvn clean package`
4. Set run command: `java -jar target/api-0.0.1-SNAPSHOT.jar`

## Environment Variables

For production backend, set these environment variables:
- `SPRING_PROFILES_ACTIVE=prod`
- `DATABASE_URL=your_production_database_url`
- `JWT_SECRET=your_jwt_secret_key`

## Frontend Configuration

Update `frontend/app.js` to point to your production backend:
```javascript
const API_URL = 'https://your-backend-url.com/api';
```
