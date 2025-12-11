import express from "express";
import {
  handleGetAllUsers,
  handleUserProfile,
} from "../controllers/user.controller";
import { protectedRoute } from "../middleware/middleware";

const router = express.Router();

router.get("/getAllUsers", protectedRoute, handleGetAllUsers);
router.get("/profile/:username", protectedRoute, handleUserProfile);

export default router;
