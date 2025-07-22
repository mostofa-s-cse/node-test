import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/express";
import { sendSuccessResponse, sendErrorResponse } from "../utils/errorResponse";
import { AuthenticationError } from "../utils/appError";
import { userService } from "../services/user.service";
import { ERROR_CODES, VALIDATION_RULES } from "../constants";

export const getMe = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AuthenticationError("User not authenticated");
    }
    
    const user = await userService.getMe(req.user.id);
    
    sendSuccessResponse(
      res, 
      { user }, 
      200, 
      "User profile retrieved successfully",
      req.headers['x-request-id'] as string
    );
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const users = await userService.getAllUsers();
    
    sendSuccessResponse(
      res, 
      { users }, 
      200, 
      "Users retrieved successfully",
      req.headers['x-request-id'] as string
    );
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    await userService.deleteUser(req.params.id);
    
    sendSuccessResponse(
      res, 
      null, 
      200, 
      "User deleted successfully",
      req.headers['x-request-id'] as string
    );
  } catch (err) {
    next(err);
  }
};

export const searchUsers = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return sendErrorResponse(
        res,
        400,
        "Search query is required",
        ERROR_CODES.VALIDATION_ERROR,
        { query: "Search query must be a non-empty string" },
        req.headers['x-request-id'] as string
      );
    }
    
    const users = await userService.searchUsers(q);
    
    sendSuccessResponse(
      res, 
      { users }, 
      200, 
      "Search completed successfully",
      req.headers['x-request-id'] as string
    );
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const { name, email } = req.body;
    
    // Validation
    if (name && (name.length < VALIDATION_RULES.NAME_MIN_LENGTH || name.length > VALIDATION_RULES.NAME_MAX_LENGTH)) {
      return sendErrorResponse(
        res,
        400,
        "Invalid name length",
        ERROR_CODES.VALIDATION_ERROR,
        { name: `Name must be between ${VALIDATION_RULES.NAME_MIN_LENGTH} and ${VALIDATION_RULES.NAME_MAX_LENGTH} characters` },
        req.headers['x-request-id'] as string
      );
    }
    
    const user = await userService.updateUser(req.params.id, { name, email });
    
    sendSuccessResponse(
      res, 
      { user }, 
      200, 
      "User updated successfully",
      req.headers['x-request-id'] as string
    );
  } catch (err) {
    next(err);
  }
};
