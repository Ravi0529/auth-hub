import express from "express";
import { protectedRoute } from "../middleware/middleware";
import {
  handleGetMe,
  handleLogin,
  handleLogout,
  handleSignup,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", handleSignup);
router.post("/login", handleLogin);
router.post("/logout", handleLogout);
router.get("/me", protectedRoute, handleGetMe);

export default router;
