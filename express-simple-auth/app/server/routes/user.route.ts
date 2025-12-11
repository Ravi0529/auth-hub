import express from "express";
import {
  handleGetAllUsers,
  handleUserProfile,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/getAllUsers", handleGetAllUsers);
router.get("/profile/:username", handleUserProfile);

export default router;
