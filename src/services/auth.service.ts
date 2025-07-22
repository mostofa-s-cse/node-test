import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { 
  AppError, 
  ConflictError, 
  NotFoundError, 
  AuthenticationError 
} from "../utils/appError";
import { IUserRepository } from "../repositories/user.repository";
import { getContainer } from "../container";
import config from "../config";

export class AuthService {
  private userRepository: IUserRepository;

  constructor() {
    this.userRepository = getContainer().userRepository;
  }

  async registerUser(name: string, email: string, password: string) {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new ConflictError("Email already registered", { email });
    }

    const hashed = await bcrypt.hash(password, config.bcrypt.rounds);
    const user = await this.userRepository.create({ name, email, password: hashed });

    return user;
  }

  async loginUser(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AuthenticationError("Invalid email");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AuthenticationError("Invalid password");
    }

    const accessToken = generateToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    return { user, accessToken, refreshToken };
  }

  async refreshUserToken(token: string) {
    try {
      const payload = verifyRefreshToken(token);
      const user = await this.userRepository.findById(payload.id);

      if (!user) {
        throw new NotFoundError("User not found");
      }

      const newAccessToken = generateToken({ id: user.id, role: user.role });
      return { accessToken: newAccessToken };
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }
      throw new AuthenticationError("Invalid refresh token");
    }
  }

  logoutUser() {
    // In production, you'd handle token blacklist here
    return { message: "Logged out successfully (client should delete tokens)" };
  }
}

// Export singleton instance
export const authService = new AuthService();
