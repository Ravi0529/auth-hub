import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      authorize: async (credentials: any) => {
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials?.email },
          });

          if (!user) {
            return null;
          }

          if (
            user &&
            (await bcrypt.compare(credentials?.password, user.password))
          ) {
            return user;
          }
          return null;
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Unknown error occurred during authorization.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
};
