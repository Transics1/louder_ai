# Louder AI - Server

Express.js backend for the Louder AI event planning application. Integrates with MongoDB for data storage and Google Gemini AI for intelligent event planning.

## Features

- **User Authentication** - JWT-based authentication with bcrypt password hashing
- **AI Event Planning** - Leverage Google Gemini 2.5 Flash for intelligent event recommendations
- **Event Management** - Store and retrieve user's event history
- **Protected Routes** - Secure endpoints with middleware authentication
- **Structured Responses** - Consistent API response format with proper error handling

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT + bcryptjs
- **AI API**: Google Gemini 2.5 Flash
- **HTTP Client**: Axios
- **Environment**: dotenv

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- Google Gemini API Key (get from [Google AI Studio](https://aistudio.google.com/))
- npm or yarn

## Installation

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the server directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/louder_ai
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
GEMINI_API_KEY=your_google_gemini_api_key_here
```

**Important**: Never commit `.env` to version control. It's in `.gitignore` by default.

### 3. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas** (cloud database):
- Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get connection string and update `MONGO_URI` in `.env`

### 4. Run Server

```bash
node server.js
```

Server will start on `http://localhost:5000`

## Available Scripts

```bash
# Start server
node server.js

# Run with automatic restart on file changes (requires nodemon)
npx nodemon server.js

# List available Gemini models
node scripts/list_gemini_models.js
```

## Project Structure

```
src/
├── app.js                 # Express app setup & routes
├── config/
│   └── db.js             # MongoDB connection
├── controllers/
│   ├── auth.controller.js        # Auth endpoints
│   ├── event.controller.js       # Event endpoints
│   └── user.controller.js        # User endpoints
├── middlewares/
│   ├── auth.middleware.js        # JWT verification
│   └── error.middleware.js       # Error handling
├── models/
│   ├── user.model.js     # User schema
│   └── event.model.js    # Event schema
├── routes/
│   ├── auth.routes.js    # /api/auth/* routes
│   ├── event.routes.js   # /api/events/* routes
│   └── user.routes.js    # /api/user/* routes
├── services/
│   ├── auth.service.js   # Auth business logic
│   └── ai.service.js     # Gemini AI integration
└── utils/
    ├── hash.js           # Password hashing
    └── token.js          # JWT token generation

scripts/
└── list_gemini_models.js # Utility to list available AI models

server.js                  # Entry point
```

## API Endpoints

### Authentication

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (201):
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token_here"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "user": { ... },
  "token": "jwt_token_here"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}

Response (200):
{
  "message": "Logged out successfully"
}
```

### User

#### Get Profile
```http
GET /api/user/profile
Authorization: Bearer {token}

Response (200):
{
  "message": "User profile fetched successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Events

#### Generate Event Plan (AI)
```http
POST /api/events/generate
Authorization: Bearer {token}
Content-Type: application/json

{
  "query": "3-day trip to Goa for 2 people with 15000 budget"
}

Response (200):
{
  "success": true,
  "data": {
    "_id": "event_id",
    "user": "user_id",
    "query": "3-day trip to Goa...",
    "response": {
      "venueName": "Beach Resort",
      "location": "Goa, India",
      "estimatedCost": "₹15,000 per person",
      "whyItFits": "Perfect beach getaway...",
      "highlights": [...],
      "bestTimeToVisit": "November-February",
      "travelTips": [...]
    },
    "createdAt": "2024-03-20T10:30:00Z"
  }
}
```

#### Get User's Events
```http
GET /api/events/my
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": [
    { event1 },
    { event2 },
    ...
  ]
}
```

#### Create Event (Manual)
```http
POST /api/events/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "query": "Trip to Jaipur",
  "response": { ... }  // JSON object with event details
}

Response (200):
{
  "success": true,
  "data": { event }
}
```

## How It Works

### 1. **Authentication Flow**
   - User signs up with email and password
   - Password is hashed using bcryptjs (12 salt rounds)
   - JWT token is generated with 7-day expiration
   - Token is stored in client's `localStorage`
   - Token is verified on all protected endpoints

### 2. **AI Event Generation Flow**
   - User sends event description query to `/api/events/generate`
   - Backend extracts query from request body
   - Query is sent to Google Gemini API with structured prompt
   - AI returns JSON with: venue name, location, cost, highlights, tips
   - Response is saved to MongoDB with user reference
   - Result is returned to client for display

### 3. **Data Storage**
   - User data includes: name, email, hashed password, auth provider
   - Event data includes: query, AI response, user reference, timestamps
   - MongoDB handles indexing and data relationships

## Environment Variables

| Variable | Default | Required | Description |
| --- | --- | --- | --- |
| `PORT` | 5000 | No | Server port |
| `MONGO_URI` | - | Yes | MongoDB connection string |
| `JWT_SECRET` | - | Yes | Secret key for JWT signing (min 32 chars) |
| `GEMINI_API_KEY` | - | Yes | Google Gemini API key |

## Error Handling

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "success": false
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `500` - Server Error

## Security Features

- ✅ **Password Hashing** - bcryptjs with 12 salt rounds
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **CORS Enabled** - Frontend can communicate with backend
- ✅ **Environment Variables** - Sensitive data not hardcoded
- ✅ **Protected Routes** - Middleware checks auth on sensitive endpoints
- ✅ **Error Handling** - No sensitive info leaked in error messages

## Middleware

### Auth Middleware
Verifies JWT token and fetches full user object (excluding password):
```javascript
app.use(protect, eventRoutes)
```

### Error Middleware
Catches and formats errors consistently.

## Deployment

### Prepare for Production

1. **Update Environment**
   ```bash
   NODE_ENV=production
   ```

2. **Use Production MongoDB**
   - Update `MONGO_URI` to cloud MongoDB (Atlas, etc.)

3. **Generate Strong JWT Secret**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-app-name

# Set environment variables
heroku config:set PORT=5000
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
heroku config:set GEMINI_API_KEY=your_gemini_key

# Deploy
git push heroku main
```

### Deploy to Railway / Render

1. Connect GitHub repository
2. Add environment variables in dashboard
3. Deploy automatically on push

## Performance Optimization

- **Lazy token verification** - Only verified on protected routes
- **MongoDB indexing** - Indexes on user ID and timestamps
- **API timeout** - 15s timeout on Gemini API calls with fallback
- **Error recovery** - Fallback response if AI fails

## Testing

### Test Authentication
```bash
# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Test Event Generation
```bash
# Generate event (use token from login)
curl -X POST http://localhost:5000/api/events/generate \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"query":"trip to Goa for 3 days"}'
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally: `mongod`
- Or update `MONGO_URI` to point to correct MongoDB instance
- Check connection string syntax

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### GEMINI_API_KEY is undefined
- Check `.env` file exists and has `GEMINI_API_KEY` set
- Ensure `dotenv` is imported at top of `server.js`
- Restart server after changing `.env`

### AI responses are generic/fallback
- Check backend logs for `❌ Gemini API Error`
- Verify API key is valid: `node scripts/list_gemini_models.js`
- Ensure internet connection is working

### JWT token errors
- Token may have expired (7-day expiration)
- Generate new token by logging in again
- Check token format: `Authorization: Bearer {token}`

## Contributing

This is a personal project. Feel free to fork and modify!

## License

MIT

## Support

For issues or questions, check the [client README](../client/README.md) for corresponding frontend documentation.
