import { Router } from "express";
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from "../controllers/cards";
import auth from "middleware/auth";

const router = Router();

router.get("/cards", auth, getCards);
router.post("/cards", auth, createCard);
router.delete("/cards/:cardId", auth, deleteCard);
router.put("/cards/:cardId/likes", auth, likeCard);
router.delete("/cards/:cardId/likes", auth, dislikeCard);

export default router;
