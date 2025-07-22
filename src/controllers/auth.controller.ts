import { Request, Response, NextFunction } from "express";
import { sendSuccessResponse } from "../utils/errorResponse";
import { authService } from "../services/auth.service";
import { ERROR_CODES } from "../constants";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.registerUser(name, email, password);
    
    sendSuccessResponse(
      res, 
      { user }, 
      201, 
      "User registered successfully",
      req.headers['x-request-id'] as string
    );
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
    
    sendSuccessResponse(
      res, 
      { user, accessToken, refreshToken }, 
      200, 
      "Login successful",
      req.headers['x-request-id'] as string
    );
  } catch (err) {
    next(err);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;
    const data = await authService.refreshUserToken(refreshToken);
    
    sendSuccessResponse(
      res, 
      data, 
      200, 
      "Token refreshed successfully",
      req.headers['x-request-id'] as string
    );
  } catch (err) {
    next(err);
  }
};

export const logout = (req: Request, res: Response) => {
  const result = authService.logoutUser();
  
  sendSuccessResponse(
    res, 
    result, 
    200, 
    "Logout successful",
    req.headers['x-request-id'] as string
  );
};
