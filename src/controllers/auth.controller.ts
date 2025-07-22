import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { AuthenticatedRequest } from "../types/express";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.registerUser(name, email, password);
    res.status(201).json({ success: true, message: "User registered successfully", user });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.loginUser(
      email,
      password
    );
    res.json({ success: true, message: "Login successful", user, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

export const getAuthUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const user = await authService.getAuthUserService(req.user?.id as string);
  res.json({ success: true, message: "Authenticated user profile retrieved", user });
};




