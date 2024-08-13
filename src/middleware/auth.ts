import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Types } from "mongoose";
import { UnauthorizedError } from "../utils/errors/UnauthorizedError";

dotenv.config();

const { JWT_SECRET = "default_secret" } = process.env;

const auth = (req: Request, res: Response, next: NextFunction): void => {
  const token =
    req.cookies.jwt || req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return next(new UnauthorizedError("Необходима авторизация"));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = {
      _id: payload as Types.ObjectId,
    };

    next();
  } catch (err: unknown) {
    return next(new UnauthorizedError("Необходима авторизация"));
  }
};

export default auth;
