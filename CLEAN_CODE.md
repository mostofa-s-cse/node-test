# Clean Code Guidelines

This document outlines the clean code principles and best practices followed in the BS23 API project.

## Principles

### 1. SOLID Principles

#### Single Responsibility Principle (SRP)
- Each class/module should have only one reason to change
- Example: `UserRepository` only handles user data operations
- Example: `AuthService` only handles authentication logic

#### Open/Closed Principle (OCP)
- Open for extension, closed for modification
- Use interfaces and abstract classes
- Example: `IUserRepository` interface allows different implementations

#### Liskov Substitution Principle (LSP)
- Derived classes must be substitutable for their base classes
- Maintain contract consistency
- Example: Any repository implementing `IUserRepository` can be used

#### Interface Segregation Principle (ISP)
- Clients should not be forced to depend on interfaces they don't use
- Keep interfaces focused and specific
- Example: Separate interfaces for different concerns

#### Dependency Inversion Principle (DIP)
- High-level modules should not depend on low-level modules
- Both should depend on abstractions
- Example: Services depend on repository interfaces, not concrete implementations

### 2. DRY (Don't Repeat Yourself)
- Avoid code duplication
- Extract common functionality into utilities
- Use shared constants and types

### 3. KISS (Keep It Simple, Stupid)
- Prefer simple solutions over complex ones
- Avoid over-engineering
- Write code that's easy to understand

## Naming Conventions

### 1. Files and Directories
```typescript
// Use kebab-case for files
user-repository.ts
auth-controller.ts
error-middleware.ts

// Use PascalCase for classes
UserRepository
AuthController
ErrorMiddleware

// Use camelCase for functions and variables
getUserById
userService
isAuthenticated
```

### 2. Functions and Methods
```typescript
// Use descriptive, action-oriented names
async getUserById(id: string): Promise<User>
async createUser(userData: CreateUserDto): Promise<User>
async updateUserProfile(id: string, data: UpdateUserDto): Promise<User>

// Avoid generic names
// ❌ Bad
async get(id: string): Promise<User>
async create(data: any): Promise<User>

// ✅ Good
async getUserById(id: string): Promise<User>
async createUser(userData: CreateUserDto): Promise<User>
```

### 3. Variables and Constants
```typescript
// Use descriptive names
const userRepository = new UserRepository();
const isUserAuthenticated = await checkAuth(token);
const MAX_RETRY_ATTEMPTS = 3;

// Avoid abbreviations
// ❌ Bad
const usr = user;
const auth = authentication;
const maxRetry = 3;

// ✅ Good
const user = userData;
const authentication = authService;
const MAX_RETRY_ATTEMPTS = 3;
```

## Code Structure

### 1. Function Length
- Keep functions under 20 lines
- Extract complex logic into separate functions
- Use early returns to reduce nesting

```typescript
// ❌ Bad - Long function
async registerUser(userData: RegisterUserDto): Promise<User> {
  // 50+ lines of code
}

// ✅ Good - Short, focused function
async registerUser(userData: RegisterUserDto): Promise<User> {
  await this.validateUserData(userData);
  const hashedPassword = await this.hashPassword(userData.password);
  const user = await this.createUser({ ...userData, password: hashedPassword });
  return user;
}
```

### 2. Class Structure
```typescript
export class UserService {
  // 1. Constructor
  constructor(private userRepository: IUserRepository) {}

  // 2. Public methods
  async getUserById(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }

  // 3. Private methods
  private async validateUser(user: User): Promise<void> {
    // validation logic
  }
}
```

### 3. Import Organization
```typescript
// 1. External libraries
import express from 'express';
import bcrypt from 'bcrypt';

// 2. Internal modules
import { UserRepository } from '../repositories/user.repository';
import { AuthService } from '../services/auth.service';

// 3. Types and interfaces
import { User, CreateUserDto } from '../types';

// 4. Constants
import { HTTP_STATUS, ERROR_CODES } from '../constants';
```

## Error Handling

### 1. Use Specific Error Types
```typescript
// ❌ Bad
throw new Error('User not found');

// ✅ Good
throw new NotFoundError('User not found');
```

### 2. Provide Context
```typescript
// ❌ Bad
throw new ValidationError('Invalid input');

// ✅ Good
throw new ValidationError('Email format is invalid', { 
  field: 'email', 
  value: email 
});
```

### 3. Handle Errors Appropriately
```typescript
// ❌ Bad
try {
  const user = await userService.getUserById(id);
  return user;
} catch (error) {
  console.log(error);
  return null;
}

// ✅ Good
try {
  const user = await userService.getUserById(id);
  return user;
} catch (error) {
  if (error instanceof NotFoundError) {
    throw error; // Re-throw specific errors
  }
  throw new InternalServerError('Failed to retrieve user');
}
```

## TypeScript Best Practices

### 1. Use Strict Types
```typescript
// ❌ Bad
const user: any = await getUser();
const id: string = user.id;

// ✅ Good
const user: User = await getUser();
const id: string = user.id;
```

### 2. Define Interfaces
```typescript
// ✅ Good
interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}
```

### 3. Use Enums for Constants
```typescript
// ✅ Good
enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
}
```

## Testing

### 1. Test Naming
```typescript
// ✅ Good
describe('UserService', () => {
  describe('getUserById', () => {
    it('should return user when valid id is provided', async () => {
      // test implementation
    });

    it('should throw NotFoundError when user does not exist', async () => {
      // test implementation
    });
  });
});
```

### 2. Arrange-Act-Assert Pattern
```typescript
it('should create user successfully', async () => {
  // Arrange
  const userData = { name: 'John', email: 'john@example.com' };
  const mockRepository = createMockUserRepository();

  // Act
  const result = await userService.createUser(userData);

  // Assert
  expect(result).toBeDefined();
  expect(result.name).toBe(userData.name);
});
```

## Documentation

### 1. JSDoc Comments
```typescript
/**
 * Creates a new user in the system
 * @param userData - The user data to create
 * @returns Promise<User> - The created user
 * @throws {ValidationError} When user data is invalid
 * @throws {ConflictError} When email already exists
 */
async createUser(userData: CreateUserDto): Promise<User> {
  // implementation
}
```

### 2. README Files
- Document setup instructions
- Explain API endpoints
- Provide usage examples
- List dependencies

### 3. Code Comments
```typescript
// Only comment on "why", not "what"
// The "what" should be clear from the code

// ❌ Bad
// Loop through users
for (const user of users) {
  // process user
}

// ✅ Good
// Skip inactive users to improve performance
for (const user of users) {
  if (!user.isActive) continue;
  // process active user
}
```

## Performance Considerations

### 1. Avoid N+1 Queries
```typescript
// ❌ Bad
const users = await userRepository.findAll();
for (const user of users) {
  const profile = await profileRepository.findByUserId(user.id);
  user.profile = profile;
}

// ✅ Good
const users = await userRepository.findAllWithProfiles();
```

### 2. Use Proper Indexing
```typescript
// Ensure database indexes on frequently queried fields
// email, userId, createdAt, etc.
```

### 3. Implement Caching
```typescript
// Cache frequently accessed data
const cachedUser = await cache.get(`user:${id}`);
if (cachedUser) return cachedUser;

const user = await userRepository.findById(id);
await cache.set(`user:${id}`, user, 3600);
return user;
```

## Security

### 1. Input Validation
```typescript
// Always validate input
const validatedData = await validateUserInput(userData);
```

### 2. Sanitize Output
```typescript
// Remove sensitive data from responses
const { password, ...safeUser } = user;
return safeUser;
```

### 3. Use Environment Variables
```typescript
// Never hardcode secrets
const jwtSecret = process.env.JWT_SECRET;
```

## Conclusion

Following these clean code principles ensures:
- Maintainable and readable code
- Easier testing and debugging
- Better collaboration among team members
- Reduced technical debt
- Improved performance and security

Remember: Clean code is not about perfection, but about continuous improvement and making code that others can easily understand and maintain. 