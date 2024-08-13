import { NextFunction, Request, Response } from "express";
import Card from "../models/Card";
import { NotFoundError } from "../utils/errors/NotFoundError";
import { ForbiddenError } from "../utils/errors/ForbiddenError";
import { IUser } from "models/User";

export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cards = await Card.find({});
    res.status(200).json(cards);
  } catch (err) {
    next(err);
  }
};

export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;

    const newCard = await Card.create({ name, link, owner });
    res.status(201).json(newCard);
  } catch (err) {
    next(err);
  }
};

export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cardId = req.params.cardId;

    const card = await Card.findById(cardId).populate("owner");

    if (!card) {
      return next(new NotFoundError("Карточка не найдена"));
    }

    if (String((card.owner as IUser)._id) !== String(req.user._id._id)) {
      return next(new ForbiddenError("Вы не можете удалить чужую карточку"));
    }

    await card.deleteOne();
    res.status(200).json({ message: "Карточка удалена" });
  } catch (err) {
    next(err);
  }
};

export const likeCard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cardId = req.params.cardId;

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ).populate("owner");

    if (!card) {
      return next(new NotFoundError("Карточка не найдена"));
    }

    res.status(200).json(card);
  } catch (err) {
    next(err);
  }
};

export const dislikeCard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cardId = req.params.cardId;

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id._id } },
      { new: true }
    ).populate("owner");

    if (!card) {
      return next(new NotFoundError("Карточка не найдена"));
    }

    res.status(200).json(card);
  } catch (err) {
    next(err);
  }
};
