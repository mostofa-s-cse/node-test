# Error Handling System

This document describes the comprehensive error handling system implemented in the BS23 API.

## Overview

The error handling system provides:
- **Structured error responses** with consistent format
- **Detailed error categorization** with specific error types
- **Request tracking** with unique request IDs
- **Comprehensive logging** for debugging
- **Input validation** with detailed error messages
- **Development vs production** error details

## Error Response Format

All error responses follow this structure:

```json
{
  "success": false,
  "error": {
    "message": "Human-readable error message",
    "statusCode": 400,
    "code": "VALIDATION_ERROR",
    "details": {
      "errors": [
        {
          "field": "email",
          "message": "email must be a valid email address"
        }
      ]
    },
    "requestId": "uuid-request-id",
    "stack": "Error stack trace (development only)"
  }
}
```

## Success Response Format

All success responses follow this structure:

```json
{
  "success": true,
  "data": {
    "user": { ... }
  },
  "message": "Operation completed successfully",
  "requestId": "uuid-request-id"
}
```

## Error Types

### 1. AppError (Base Error Class)
- **Purpose**: Base class for all application errors
- **Properties**: `statusCode`, `isOperational`, `code`, `details`
- **Usage**: For general application errors

### 2. ValidationError (400)
- **Purpose**: Input validation failures
- **Usage**: When request data doesn't meet requirements
- **Example**: Invalid email format, missing required fields

### 3. AuthenticationError (401)
- **Purpose**: Authentication failures
- **Usage**: Invalid credentials, missing tokens
- **Example**: Wrong password, expired token

### 4. AuthorizationError (403)
- **Purpose**: Authorization failures
- **Usage**: Insufficient permissions
- **Example**: User trying to access admin-only resource

### 5. NotFoundError (404)
- **Purpose**: Resource not found
- **Usage**: When requested resource doesn't exist
- **Example**: User not found, invalid ID

### 6. ConflictError (409)
- **Purpose**: Resource conflicts
- **Usage**: When operation conflicts with existing data
- **Example**: Email already registered

### 7. RateLimitError (429)
- **Purpose**: Rate limiting
- **Usage**: Too many requests
- **Example**: API rate limit exceeded

## Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `VALIDATION_ERROR` | Input validation failed | 400 |
| `AUTHENTICATION_ERROR` | Authentication failed | 401 |
| `AUTHORIZATION_ERROR` | Access denied | 403 |
| `NOT_FOUND_ERROR` | Resource not found | 404 |
| `CONFLICT_ERROR` | Resource conflict | 409 |
| `RATE_LIMIT_ERROR` | Too many requests | 429 |
| `INTERNAL_ERROR` | Internal server error | 500 |
| `INVALID_TOKEN` | Invalid JWT token | 401 |
| `TOKEN_EXPIRED` | JWT token expired | 401 |
| `DUPLICATE_FIELD` | Duplicate field value | 400 |
| `UNIQUE_CONSTRAINT_VIOLATION` | Database unique constraint | 409 |
| `RECORD_NOT_FOUND` | Database record not found | 404 |

## Middleware

### 1. Error Handler Middleware
- **File**: `src/middleware/error.middleware.ts`
- **Purpose**: Centralized error handling
- **Features**:
  - Converts various error types to AppError
  - Handles Prisma, JWT, and Mongoose errors
  - Provides detailed logging
  - Environment-specific error details

### 2. Validation Middleware
- **File**: `src/middleware/validation.middleware.ts`
- **Purpose**: Request input validation
- **Features**:
  - Type validation (string, email, number, boolean)
  - Length validation
  - Pattern matching
  - Custom validation functions
  - Detailed field-specific error messages

### 3. Request ID Middleware
- **File**: `src/middleware/requestId.middleware.ts`
- **Purpose**: Request tracking
- **Features**:
  - Generates unique request IDs
  - Adds request ID to headers
  - Enables request tracing

## Usage Examples

### Throwing Errors in Services

```typescript
import { NotFoundError, ConflictError, ValidationError } from '../utils/appError';

// Not found
if (!user) {
  throw new NotFoundError('User not found');
}

// Conflict
if (existingUser) {
  throw new ConflictError('Email already registered', { email });
}

// Validation
if (!isValidEmail(email)) {
  throw new ValidationError('Invalid email format', { email });
}
```

### Using Validation Middleware

```typescript
import { validateRequest, authValidationRules } from '../middleware/validation.middleware';

router.post('/register', validateRequest(authValidationRules.register), register);
```

### Custom Validation Rules

```typescript
const customRules = [
  {
    field: 'password',
    required: true,
    type: 'string',
    minLength: 8,
    custom: (value) => {
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumbers = /\d/.test(value);
      
      if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
        return 'Password must contain uppercase, lowercase, and numbers';
      }
      return true;
    }
  }
];
```

## Logging

The error handler provides comprehensive logging:

```typescript
console.error('Error:', {
  message: err.message,
  stack: err.stack,
  url: req.url,
  method: req.method,
  body: req.body,
  params: req.params,
  query: req.query,
  userAgent: req.get('User-Agent'),
  ip: req.ip,
  timestamp: new Date().toISOString()
});
```

## Environment Differences

### Development
- Full error details included in response
- Stack traces included
- Detailed logging

### Production
- Minimal error details (no stack traces)
- Generic error messages for security
- Operational vs programming error distinction

## Best Practices

1. **Always use specific error types** instead of generic AppError
2. **Provide meaningful error messages** for users
3. **Include relevant details** for debugging
4. **Use validation middleware** for input validation
5. **Handle async errors** with try-catch and next(err)
6. **Log errors appropriately** for monitoring
7. **Use request IDs** for request tracing
8. **Test error scenarios** thoroughly

## Testing Error Handling

```typescript
// Test validation errors
const response = await request(app)
  .post('/api/auth/register')
  .send({ email: 'invalid-email' });

expect(response.status).toBe(400);
expect(response.body.error.code).toBe('VALIDATION_ERROR');

// Test authentication errors
const response = await request(app)
  .post('/api/auth/login')
  .send({ email: 'test@example.com', password: 'wrong' });

expect(response.status).toBe(401);
expect(response.body.error.code).toBe('AUTHENTICATION_ERROR');
``` 