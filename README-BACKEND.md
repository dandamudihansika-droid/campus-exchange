# Campus Exchange - Backend Setup

This document explains how to set up and run the backend server for the Campus Exchange application.

## Backend Features

- **RESTful API** with Express.js
- **JWT Authentication** for user security
- **File Upload** support for item images
- **Data Validation** and error handling
- **CORS Support** for frontend integration
- **In-memory Storage** (easily upgradeable to database)

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

## Installation

1. Navigate to the project directory:
```bash
cd "field project (2)/field project"
```

2. Install dependencies:
```bash
npm install
```

## Running the Backend

### Development Mode
```bash
npm run dev
```
This will start the server with auto-restart functionality using nodemon.

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and get JWT token

### Items
- `GET /api/items` - Get all items (with optional filtering)
- `GET /api/items/:id` - Get specific item by ID
- `POST /api/items` - Create new item (requires authentication)
- `PUT /api/items/:id` - Update item (requires authentication)
- `DELETE /api/items/:id` - Delete item (requires authentication)
- `GET /api/user/items` - Get current user's items (requires authentication)

### Categories
- `GET /api/categories` - Get all categories

## API Usage Examples

### Register User
```javascript
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123"
}
```

### Login User
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Item
```javascript
POST /api/items
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

name: "Wireless Headphones"
category: "electronics"
sellingPrice: "1200"
originalPrice: "2500"
condition: "Like New"
yearsUsed: "1"
yearBought: "2024"
description: "Wireless headphones with clear sound"
sellerName: "John Doe"
contact: "1234567890"
location: "Vignan University"
image: <file>
```

### Get Items with Filters
```javascript
GET /api/items?category=electronics&search=headphones
```

## File Upload

- Images are uploaded to the `/uploads` directory
- Supported formats: JPEG, PNG, GIF, WebP
- Maximum file size: 5MB
- Files are served statically at `/uploads/filename`

## Authentication

- Uses JWT (JSON Web Tokens) for authentication
- Tokens expire after 24 hours
- Include token in Authorization header: `Bearer <token>`
- Protected routes require valid authentication

## Data Storage

Currently uses in-memory storage for simplicity. In production, consider:
- MongoDB with Mongoose
- PostgreSQL with Sequelize
- MySQL with Sequelize

## Environment Variables

Create a `.env` file for production:
```env
PORT=3000
JWT_SECRET=your-secret-key-here
NODE_ENV=production
```

## Error Handling

The API returns consistent error responses:
```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Development Notes

- The server automatically creates an `/uploads` directory if it doesn't exist
- CORS is enabled for all origins in development
- Request logging can be added for debugging
- Rate limiting can be implemented for production

## Testing the API

You can test the API using:
- Postman
- curl commands
- Browser's network tab
- Frontend application

Example curl command for getting items:
```bash
curl http://localhost:3000/api/items
```

## Production Deployment

For production deployment:
1. Set NODE_ENV=production
2. Use a process manager like PM2
3. Configure reverse proxy (nginx/Apache)
4. Set up SSL/TLS
5. Use a proper database
6. Implement logging and monitoring
7. Set up backup strategies

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
netstat -tulpn | grep :3000

# Kill process
kill -9 <PID>
```

### Module Not Found
```bash
# Clear npm cache and reinstall
npm cache clean --force
npm install
```

### Permission Issues
```bash
# On Unix systems, if you get permission errors
sudo chown -R $USER:$USER ./
sudo chmod -R 755 ./
```

## Next Steps

To enhance the backend:
1. Add database integration
2. Implement password reset functionality
3. Add email verification
4. Create admin panel
5. Add analytics and reporting
6. Implement caching
7. Add API rate limiting
8. Create comprehensive tests
