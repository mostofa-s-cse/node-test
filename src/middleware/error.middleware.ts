import { NextFunction, Request, Response } from "express";

export const notFound = (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Page Not Found",
  });
};

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err.status || 500;

  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
