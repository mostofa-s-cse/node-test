import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { AppError } from "../utils/appError";

const prisma = new PrismaClient();

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError("Email already registered", 400);

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("User not found", 404);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid credentials", 401);

  const accessToken = generateToken({ id: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id });

  return { user, accessToken, refreshToken };
};

export const refreshUserToken = async (token: string) => {
  try {
    const payload = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.id } });

    if (!user) throw new AppError("User not found", 404);

    const newAccessToken = generateToken({ id: user.id, role: user.role });
    return { accessToken: newAccessToken };
  } catch (err) {
    throw new AppError("Invalid refresh token", 403);
  }
};

export const logoutUser = () => {
  // In production, you'd handle token blacklist here
  return { message: "Logged out successfully (client should delete tokens)" };
};
