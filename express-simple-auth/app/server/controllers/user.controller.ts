import type { Request, Response } from "express";
import { prisma } from "../prisma/db";

const userPublicSelect = {
  id: true,
  username: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export const handleGetAllUsers = async (_: Request, res: Response) => {
  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: userPublicSelect,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.user.count(),
    ]);

    return res.status(200).json({
      data: users,
      total,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleUserProfile = async (req: Request, res: Response) => {
  try {
    const rawUsername = req.params.username;

    if (!rawUsername || typeof rawUsername !== "string") {
      return res.status(400).json({ error: "Invalid username parameter" });
    }

    const username = rawUsername.trim();

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      select: userPublicSelect,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
