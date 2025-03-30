import { NextFunction, Request, Response } from "express";
import {JWT_SECRET} from "@repo/backend-common/config"
import dotenv from "dotenv";
dotenv.config(); 
import jwt from "jsonwebtoken";

console.log(JWT_SECRET);

export function middleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorrization"] ?? "";

    
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  if (!token) {
    return res.status(401).json({ message: "Authorization token is missing" });
  }
  //@ts-ignore
  const decoded = jwt.verify(token, JWT_SECRET);

  if (decoded.userId) {
    // @ts-ignore
    req.userId = decoded.userId;
  } else {
    res.status(403).json({
      message: "Unauthorised",
    });
  }
}
