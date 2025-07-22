import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { AppError } from "../utils/appError";
import { z } from "zod";

const prisma = new PrismaClient();

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const parsed = registerSchema.safeParse({ name, email, password });
  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0].message, 400);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError("Email already registered", 400);

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0].message, 400);
  }

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

export const getAuthUserService = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError("User not found", 404);
  return user;
};



