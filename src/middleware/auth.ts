import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Types } from "mongoose";

dotenv.config();

const { JWT_SECRET = "default_secret" } = process.env;

const auth = (req: Request, res: Response, next: NextFunction): void => {
  const token =
    req.cookies.jwt || req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "Необходима авторизация" });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = {
      _id: payload as Types.ObjectId,
    };

    next();
  } catch (err: unknown) {
    res.status(401).json({ message: "Необходима авторизация" });
  }
};

export default auth;
