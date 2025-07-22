# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
This API uses JWT (JSON Web Token) authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication Endpoints

#### 1. Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Email already registered"
}
```

#### 2. Login User
**POST** `/auth/login`

Authenticate user and receive access tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401):**
```json
{
  "message": "Invalid credentials"
}
```

#### 3. Refresh Token
**POST** `/auth/refresh`

Get a new access token using a refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (403):**
```json
{
  "message": "Invalid refresh token"
}
```

#### 4. Logout
**POST** `/auth/logout`

Logout user (client should delete tokens).

**Response (200):**
```json
{
  "message": "Logged out successfully (client should delete tokens)"
}
```

### User Endpoints

#### 1. Get Current User
**GET** `/users/me`

Get the authenticated user's profile.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response (200):**
```json
{
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "message": "User not authenticated"
}
```

#### 2. Get All Users (Admin Only)
**GET** `/users`

Get all users (requires admin role).

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response (200):**
```json
{
  "users": [
    {
      "id": "user-id-1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "user-id-2",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "admin",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Error Response (403):**
```json
{
  "message": "Forbidden"
}
```

#### 3. Search Users (Admin Only)
**GET** `/users/search?q=<search-query>`

Search users by name or email (requires admin role).

**Headers:**
```
Authorization: Bearer <access-token>
```

**Query Parameters:**
- `q` (string): Search query for name or email

**Response (200):**
```json
{
  "users": [
    {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 4. Delete User (Admin Only)
**DELETE** `/users/:id`

Delete a user by ID (requires admin role).

**Headers:**
```
Authorization: Bearer <access-token>
```

**Path Parameters:**
- `id` (string): User ID to delete

**Response (200):**
```json
{
  "message": "User deleted"
}
```

**Error Response (404):**
```json
{
  "message": "User not found"
}
```

## Error Responses

### Common Error Codes

- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

### Error Response Format
```json
{
  "message": "Error description"
}
```

## Authentication Flow

1. **Register** a new user account
2. **Login** to receive access and refresh tokens
3. **Use access token** in Authorization header for protected endpoints
4. **Refresh token** when access token expires
5. **Logout** by deleting tokens on client side

## Token Information

- **Access Token**: Valid for 15 minutes
- **Refresh Token**: Valid for 7 days
- **Token Format**: JWT (JSON Web Token)

## Database Schema

### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      String   @default("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# JWT Secrets
JWT_SECRET="your-jwt-secret-key"
JWT_REFRESH_SECRET="your-jwt-refresh-secret-key"

# Server
PORT=5000
```

## Development Commands

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev

# Build for production
npm run build

# Generate a new secret key
npm run generate-secret
```

## Testing Examples

### Using cURL

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get current user (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer TOKEN"
```

### Using JavaScript/Fetch

```javascript
// Register
const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  })
});

// Login
const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

const { accessToken } = await loginResponse.json();

// Get current user
const userResponse = await fetch('http://localhost:5000/api/users/me', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
``` 