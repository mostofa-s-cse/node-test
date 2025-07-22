import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";
import { ERROR_CODES } from "../constants";

export const notFound = (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: ERROR_CODES.NOT_FOUND_ERROR,
      message: 'The requested resource was not found',
      statusCode: 404
    }
  });
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
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

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404, ERROR_CODES.INVALID_TOKEN);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value: ${field}. Please use another value.`;
    error = new AppError(message, 400, ERROR_CODES.DUPLICATE_FIELD, { field });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message).join(', ');
    error = new AppError(message, 400, ERROR_CODES.VALIDATION_ERROR, err.errors);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please log in again.';
    error = new AppError(message, 401, ERROR_CODES.INVALID_TOKEN);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired. Please log in again.';
    error = new AppError(message, 401, ERROR_CODES.TOKEN_EXPIRED);
  }

  // Prisma errors
  if (err.code === 'P2002') {
    const message = 'A record with this unique field already exists';
    error = new AppError(message, 409, ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION);
  }

  if (err.code === 'P2025') {
    const message = 'Record not found';
    error = new AppError(message, 404, ERROR_CODES.RECORD_NOT_FOUND);
  }

  // Determine response structure
  const statusCode = error.statusCode || 500;
  const isOperational = error.isOperational !== false; // Default to true for AppError instances

  // In development, send error details
  const isDevelopment = process.env.NODE_ENV === 'development';

  const errorResponse: any = {
    success: false,
    error: {
      message: error.message || 'Internal Server Error',
      statusCode,
      code: error.code || ERROR_CODES.INTERNAL_ERROR
    }
  };

  // Add details in development or for operational errors
  if (isDevelopment || (error.details && isOperational)) {
    errorResponse.error.details = error.details;
  }

  // Add stack trace in development
  if (isDevelopment) {
    errorResponse.error.stack = error.stack;
  }

  // Add request ID if available
  if (req.headers['x-request-id']) {
    errorResponse.error.requestId = req.headers['x-request-id'];
  }

  res.status(statusCode).json(errorResponse);

  // Log operational errors differently from programming errors
  if (!isOperational) {
    console.error('Non-operational error:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method
    });
  }
};
