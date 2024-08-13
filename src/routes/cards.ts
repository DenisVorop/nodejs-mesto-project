import { Router } from "express";
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
router.post("/cards", auth, createCard);
router.put("/cards/:cardId/likes", auth, likeCard);
router.delete("/cards/:cardId/likes", auth, dislikeCard);
router.delete("/cards/:cardId", auth, deleteCard);

export default router;
