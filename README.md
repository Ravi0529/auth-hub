# Auth-Hub

- Clerk Auth
- Next Auth

## 1. next-auth

### Steps:

1. **Initialize Prisma**

   - Run `pnpx prisma init`.
   - Define your database schema in `schema.prisma`.

2. **Apply Migrations & Generate Client**

   - Run your migration: `prisma migrate dev`.
   - Generate the Prisma Client.
   - Add a `src/lib/prisma.ts` file to export and manage your Prisma client instance.

3. **Set Up Sign-Up API Route**

   - Create `src/api/signup/route.ts`.
   - Implement user registration logic to accept `{ username, password, email }`, validate inputs, and store the new user in the database.

4. **Configure NextAuth for Sign-In**

   - Create `src/api/auth/[...nextauth]/route.ts` for NextAuth.js API handling.
   - Add an `options.ts` file to configure providers, callbacks, and session behavior.

5. **Add Middleware for Route Protection**

   - Create `src/middleware.ts` to guard protected routes, handle redirects, and maintain authentication checks.

6. **Create Authentication Context Provider**

   - Add `src/context/AuthProvider.tsx`, wrapping children with NextAuth’s `<SessionProvider>` to provide authentication context throughout your app.

7. **Include AuthProvider in Root Layout**

   - Use `<AuthProvider>` in your main `layout.tsx` to ensure session context is available globally.

8. **Build Signup Frontend**

   - Create the sign-up page at `app/(auth)/signup/page.tsx`.

9. **Build Signin Frontend**

   - Create the sign-in page at `app/(auth)/signin/page.tsx`.

10. **Define NextAuth Types**

    - Add `src/types/next-auth.d.ts` to customize NextAuth types and ensure type safety. (Recommended for TypeScript projects.)

11. **Create Navbar with User Session**

    - Build a navigation component that displays user session info and allows sign in/out.

12. **Configure Google Provider**

    - Add Google as an authentication provider.
    - Obtain and set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` from Google Cloud Console (note: you'll need unique credentials for each project).

13. **Update Options, Pages, and Navbar**
    - Refine your `options.ts`, `signin.tsx`, `signup.tsx`, and navbar to fully support and integrate provider-based authentication.
