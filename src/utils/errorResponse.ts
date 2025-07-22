import { Response } from 'express';
import { ERROR_CODES } from '../constants';

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    statusCode: number;
    code: string;
    details?: any;
    stack?: string;
    requestId?: string;
  };
}

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  requestId?: string;
}

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  code: string = ERROR_CODES.INTERNAL_ERROR,
  details?: any,
  requestId?: string
) => {
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message,
      statusCode,
      code
    }
  };

  if (details) {
    errorResponse.error.details = details;
  }

  if (requestId) {
    errorResponse.error.requestId = requestId;
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = new Error().stack;
  }

  return res.status(statusCode).json(errorResponse);
};

export const sendSuccessResponse = <T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  message?: string,
  requestId?: string
) => {
  const successResponse: SuccessResponse<T> = {
    success: true,
    data
  };

  if (message) {
    successResponse.message = message;
  }

  if (requestId) {
    successResponse.requestId = requestId;
  }

  return res.status(statusCode).json(successResponse);
};

// Common error responses
export const commonErrors = {
  validation: (details: any, requestId?: string) => ({
    statusCode: 400,
    message: 'Validation failed',
    code: ERROR_CODES.VALIDATION_ERROR,
    details,
    requestId
  }),
  
  notFound: (resource: string = 'Resource', requestId?: string) => ({
    statusCode: 404,
    message: `${resource} not found`,
    code: ERROR_CODES.NOT_FOUND_ERROR,
    requestId
  }),
  
  unauthorized: (message: string = 'Authentication required', requestId?: string) => ({
    statusCode: 401,
    message,
    code: ERROR_CODES.AUTHENTICATION_ERROR,
    requestId
  }),
  
  forbidden: (message: string = 'Access denied', requestId?: string) => ({
    statusCode: 403,
    message,
    code: ERROR_CODES.AUTHORIZATION_ERROR,
    requestId
  }),
  
  conflict: (message: string, details?: any, requestId?: string) => ({
    statusCode: 409,
    message,
    code: ERROR_CODES.CONFLICT_ERROR,
    details,
    requestId
  }),
  
  internal: (message: string = 'Internal server error', requestId?: string) => ({
    statusCode: 500,
    message,
    code: ERROR_CODES.INTERNAL_ERROR,
    requestId
  })
}; 