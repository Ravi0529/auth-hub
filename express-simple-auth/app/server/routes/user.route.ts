import express from "express";
import {
  handleGetAllUsers,
  handleUserProfile,
} from "../controllers/user.controller";
import { protectedRoute, restrictTo } from "../middleware/middleware";

const router = express.Router();

router.get(
  "/getAllUsers",
  protectedRoute,
  restrictTo("ADMIN"),
  handleGetAllUsers
);
router.get("/profile/:username", protectedRoute, handleUserProfile);

export default router;
