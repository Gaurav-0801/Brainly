import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";

// Extend Request type to allow userId
export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const userMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    res.status(401).json({ message: "Authorization token missing" });
    return;
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_PASSWORD) as { id: string };
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
