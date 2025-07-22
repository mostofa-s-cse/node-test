import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Use existing request ID from headers or generate new one
  const requestId = req.headers['x-request-id'] as string || uuidv4();
  
  // Add request ID to request object
  req.headers['x-request-id'] = requestId;
  
  // Add request ID to response headers
  res.setHeader('x-request-id', requestId);
  
  next();
}; 