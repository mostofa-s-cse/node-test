import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/express";
import { verifyToken } from "../utils/jwt";

export const isAuthenticated = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Authorization token missing" });

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export const allowRoles = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(403).json({ success: false, message: "User not authenticated" });
    }
    if (!roles.includes(req.user.role || "")) {
      return res.status(403).json({ success: false, message: "Access denied: insufficient permissions" });
    }
    next();
  };
};
