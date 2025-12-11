import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must by at least 2 characters long")
  .max(60, "Username must not exceed 60 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores"
  );

export const emailValidation = z
  .string()
  .email({ message: "Please provide a valid email address" });

export const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

export const firstNameValidation = z
  .string()
  .max(60, "Firstname must not exceed 60 characters");

export const lastNameValidation = z
  .string()
  .max(60, "Lastname must not exceed 60 characters");

export const SignUpSchema = z.object({
  username: usernameValidation,
  firstName: firstNameValidation,
  lastName: lastNameValidation,
  email: emailValidation,
  password: passwordValidation,
});
