import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt, { type Secret } from "jsonwebtoken";

import User from "../models/User";
import { NotFoundError } from "../utils/errors/NotFoundError";
import { UnauthorizedError } from "../utils/errors/UnauthorizedError";

dotenv.config();

const { JWT_SECRET = "default_secret", JWT_EXPIRES_IN = "7d" } = process.env;

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return next(new UnauthorizedError("Необходима авторизация"));
    }

    const user = await User.findById(userId);

    if (!user) {
      return next(new NotFoundError("Пользователь не найден"));
    }

    res.status(200).json(user);
  } catch (err: unknown) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new UnauthorizedError("Неправильные почта или пароль"));
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return next(new UnauthorizedError("Неправильные почта или пароль"));
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET as Secret, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res
      .status(200)
      .cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "Аутентификация успешна" });
  } catch (err: unknown) {
    next(err);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return next(new NotFoundError("Пользователь не найден"));
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, about, avatar, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });

    const { password: _, ...user } = newUser.toJSON();

    res.status(201).json(user);
  } catch (err: any) {
    next(err);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, about } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new NotFoundError("Пользователь не найден"));
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const updateAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new NotFoundError("Пользователь не найден"));
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
