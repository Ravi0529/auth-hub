import { z } from "zod";
import { passwordValidation } from "./signUpSchema";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Please enter your email or username")
    .refine(
      (value) =>
        /^[a-zA-Z0-9_]+$/.test(value) ||
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      "Please enter a valid email or username"
    ),
  password: passwordValidation,
});
