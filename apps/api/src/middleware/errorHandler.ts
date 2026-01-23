import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal Server Error";

  if (env.NODE_ENV === "development") {
    console.error("Error:", err);
  }

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

export function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const error: AppError = new Error("Route not found: " + req.originalUrl);
  error.statusCode = 404;
  error.isOperational = true;
  next(error);
}
