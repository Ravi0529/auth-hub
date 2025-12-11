import type { Request, Response } from "express";
import { prisma } from "../prisma/db";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken";
import bcrypt from "bcryptjs";
import { signUpSchema } from "../../../packages/validation/src/signUpSchema";
import { loginSchema } from "../../../packages/validation/src/loginSchema";
import { ZodError } from "zod";

const sanitizeUser = (user: any) => {
  if (!user) return null;

  const { password, ...safe } = user;
  return safe;
};

export const handleSignup = async (req: Request, res: Response) => {
  try {
    const parseResult = signUpSchema.safeParse(req.body);

    if (!parseResult.success) {
      const zError = parseResult.error as ZodError;
      return res.status(400).json({ error: zError });
    }

    const { username, firstName, lastName, email, password } = parseResult.data;

    const [existingUsername, existingEmail] = await Promise.all([
      prisma.user.findUnique({
        where: {
          username,
        },
      }),
      prisma.user.findUnique({
        where: {
          email,
        },
      }),
    ]);

    if (existingUsername) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    if (existingEmail) {
      res.status(400).json({ error: "Email is already taken" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        username,
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    generateTokenAndSetCookie(newUser.id, res);

    return res.status(201).json({
      message: "User created successfully",
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleLogin = async (req: Request, res: Response) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);

    if (!parseResult.success) {
      const zError = parseResult.error as ZodError;
      return res.status(400).json({ error: zError });
    }

    const { identifier, password } = parseResult.data;

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    const user = await prisma.user.findUnique({
      where: isEmail ? { email: identifier } : { username: identifier },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    generateTokenAndSetCookie(user.id, res);

    return res.status(200).json({
      message: "Logged in successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleLogout = async (_: Request, res: Response) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
