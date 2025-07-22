# BS23 Node.js API

A robust Node.js Express API with JWT authentication, Prisma ORM, and TypeScript.

## Features

- 🔐 **JWT Authentication** with access and refresh tokens
- 👥 **User Management** with role-based access control
- 🗄️ **Prisma ORM** for type-safe database operations
- 📝 **TypeScript** for better development experience
- 🔍 **User Search** functionality
- 🛡️ **Role-based Authorization** (user/admin)
- 📚 **Comprehensive API Documentation**
- 🧪 **Postman Collection** for testing

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (via Prisma)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Development**: nodemon, ts-node

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd node-bs23
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   JWT_SECRET="your-jwt-secret-key"
   JWT_REFRESH_SECRET="your-jwt-refresh-secret-key"
   PORT=5000
   ```

4. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

5. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000/api`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run generate-secret` - Generate a new JWT secret key

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/me` - Get current user profile
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/search` - Search users (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

## Database Schema

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

## Authentication Flow

1. **Register** a new user account
2. **Login** to receive access and refresh tokens
3. **Use access token** in Authorization header for protected endpoints
4. **Refresh token** when access token expires (15 minutes)
5. **Logout** by deleting tokens on client side

## Testing

### Using Postman
1. Import the `BS23_API.postman_collection.json` file
2. Set the `baseUrl` variable to your server URL
3. Run the "Login User" request to automatically set tokens
4. Test other endpoints

### Using cURL
```bash
# Register
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

## Project Structure

```
src/
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── routes/          # API routes
│   └── v1/         # Version 1 API routes
├── services/        # Business logic
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── app.ts          # Express app configuration
└── server.ts       # Server entry point
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | Secret for JWT access tokens | "your-secret" |
| `JWT_REFRESH_SECRET` | Secret for JWT refresh tokens | "your-refresh-secret" |
| `PORT` | Server port | 5000 |

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Role-based Access**: Admin and user roles
- **Input Validation**: Request body validation
- **Error Handling**: Centralized error handling
- **CORS**: Cross-origin resource sharing enabled

## Development

### Adding New Endpoints

1. Create controller function in `src/controllers/`
2. Add route in `src/routes/v1/`
3. Update API documentation
4. Add tests if needed

### Database Changes

1. Update Prisma schema in `prisma/schema.prisma`
2. Generate migration: `npx prisma migrate dev`
3. Update Prisma client: `npx prisma generate`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License

## Support

For support and questions, please open an issue in the repository. 