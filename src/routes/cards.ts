import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from "../controllers/cards";
import auth from "../middleware/auth";

const router = Router();

router.get("/cards", auth, getCards);

router.post(
  "/cards",
  auth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().uri().required(),
    }),
  }),
  createCard
);

router.put(
  "/cards/:cardId/likes",
  auth,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  likeCard
);

router.delete(
  "/cards/:cardId/likes",
  auth,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  dislikeCard
);

router.delete(
  "/cards/:cardId",
  auth,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteCard
);

export default router;
