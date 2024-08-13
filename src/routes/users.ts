import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} from "../controllers/users";
import auth from "../middleware/auth";

const router = Router();

router.get("/users", auth, getUsers);

router.get("/users/me", auth, getCurrentUser);

router.patch(
  "/users/me",
  auth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(200).required(),
    }),
  }),
  updateProfile
);

router.patch(
  "/users/me/avatar",
  auth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      avatar: Joi.string().uri().required(),
    }),
  }),
  updateAvatar
);

router.get(
  "/users/:userId",
  auth,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      userId: Joi.string().hex().length(24).required(),
    }),
  }),
  getUserById
);

export default router;
