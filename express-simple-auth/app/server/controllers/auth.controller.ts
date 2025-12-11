import type { Request, Response } from "express";
import { prisma } from "../prisma/db";
import bcrypt from "bcryptjs";

export const handleSignup = async (req: Request, res: Response) => {
  try {
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleLogin = async (req: Request, res: Response) => {};

export const handleLogout = async (req: Request, res: Response) => {};

export const handleGetMe = async (req: Request, res: Response) => {};
