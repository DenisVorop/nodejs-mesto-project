import { Router } from "express";
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
router.get("/users/:userId", auth, getUserById);
router.patch("/users/me", auth, updateProfile);
router.patch("/users/me/avatar", auth, updateAvatar);
router.get("/users/me", auth, getCurrentUser);

export default router;
