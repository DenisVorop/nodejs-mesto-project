import { Request, Response } from "express";
import Card from "../models/Card";
import mongoose from "mongoose";

export const getCards = async (req: Request, res: Response): Promise<void> => {
  try {
    const cards = await Card.find({});
    res.status(200).json(cards);
  } catch (err) {
    res.status(500).json({ message: "Непредвиденная ошибка сервера" });
  }
};

export const createCard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;

    const newCard = await Card.create({ name, link, owner });
    res.status(201).json(newCard);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).json({
        message: "Некорректные данные для создания карточки",
        error: err.message,
      });
      return;
    }
    res.status(500).json({ message: "Непредвиденная ошибка сервера" });
  }
};

export const deleteCard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cardId = req.params.cardId;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      res.status(400).json({ message: "Некорректный _id карточки" });
      return;
    }

    const card = await Card.findByIdAndDelete(cardId);
    if (!card) {
      res.status(404).json({ message: "Карточка не найдена" });
      return;
    }

    res.status(200).json({ message: "Карточка удалена" });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      res.status(400).json({ message: "Некорректный _id карточки" });
      return;
    }
    res.status(500).json({ message: "Непредвиденная ошибка сервера" });
  }
};

export const likeCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const cardId = req.params.cardId;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      res.status(400).json({ message: "Некорректный _id карточки" });
      return;
    }

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ).populate("owner");

    if (!card) {
      res.status(404).json({ message: "Карточка не найдена" });
      return;
    }

    res.status(200).json(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      res.status(400).json({ message: "Некорректный _id карточки" });
      return;
    }
    res.status(500).json({ message: "Непредвиденная ошибка сервера" });
  }
};

export const dislikeCard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cardId = req.params.cardId;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      res.status(400).json({ message: "Некорректный _id карточки" });
      return;
    }

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ).populate("owner");

    if (!card) {
      res.status(404).json({ message: "Карточка не найдена" });
      return;
    }

    res.status(200).json(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      res.status(400).json({ message: "Некорректный _id карточки" });
      return;
    }
    res.status(500).json({ message: "Непредвиденная ошибка сервера" });
  }
};
