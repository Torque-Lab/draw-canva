import { NextFunction, Request, Response } from "express";

// Extend the Request interface to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
import { JWT_SECRET } from "@repo/backend-common/config";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export function middleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"] ?? "";
  console.log(req.headers);

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  if (!token) {
    return res.status(401).json({ message: "Authorization token is missing" });
  }
  try {
    console.log(token);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string };
    console.log(decoded);
    if (!decoded.userId) {
      console.error("Decoded token does not contain userId:", decoded);
      return res.status(403).json({
        message: "Unauthorised: userId is missing in token",
      });
    }
    console.log(decoded);

    if (decoded && decoded.userId) {
      req.userId = decoded.userId;
      next();
    } else {
      return res.status(403).json({
        message: "Unauthorised",
      });
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
}
