import { Request, Response } from "express";
import User from "../models/User";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Непредвиденная ошибка сервера" });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Некорректный _id пользователя" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "Пользователь не найден" });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      res.status(400).json({ message: "Некорректный идентификатор" });
    } else {
      res.status(500).json({ message: "Непредвиденная ошибка сервера" });
    }
  }
};

export const createUser = async (
  req: Request,
  res: Response
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
    res.status(201).json(newUser);
  } catch (err: any) {
    if (err.code === 11000) {
      res
        .status(409)
        .json({ message: "Пользователь с таким email уже существует" });
      return;
    }
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: "Ошибка валидации", error: err.message });
      return;
    }
    res.status(500).json({ message: "Непредвиденная ошибка сервера" });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, about } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({ message: "Пользователь не найден" });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: "Ошибка валидации", error: err.message });
    } else {
      res.status(500).json({ message: "Непредвиденная ошибка сервера" });
    }
  }
};

export const updateAvatar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({ message: "Пользователь не найден" });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: "Ошибка валидации", error: err.message });
    } else {
      res.status(500).json({ message: "Непредвиденная ошибка сервера" });
    }
  }
};
