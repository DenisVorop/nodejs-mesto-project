import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res
      .status(400)
      .json({ message: "Ошибка валидации", error: err.message });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: "Некорректный идентификатор" });
  }

  if (err.code === 11000) {
    return res
      .status(409)
      .json({ message: "Пользователь с таким email уже существует" });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "Некорректный токен" });
  }

  console.error(err);

  res.status(500).json({ message: "Непредвиденная ошибка сервера" });
};
