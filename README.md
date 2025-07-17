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

---

## 2. clerk-auth

### Steps:

1. **Initialize Prisma**

   - Run `pnpx prisma init` and define your database schema in `schema.prisma`.

2. **Apply Migrations & Generate Client**

   - Run `prisma migrate dev` and `prisma generate`.
   - Add a `src/lib/prisma.ts` file to manage your Prisma client instance.

3. **(Optional) Create Error Page**

   - Add an error page at `src/app/error/page.tsx` for custom error handling.

4. **Set Up Clerk Middleware**

   - Configure `src/middleware.ts` to handle authentication and route protection using Clerk.

5. **Wrap App with ClerkProvider**

   - In your main `layout.tsx`, wrap the body with `<ClerkProvider>` to provide Clerk context throughout your app.

6. **Create Signup Page with Clerk Auth**

   - Implement the sign-up page at `src/app/(auth)/signup/page.tsx` using Clerk authentication.

7. **Add Email Verification Logic**

   - Integrate email verification code logic in the signup page to verify user emails.

8. **Create Signin Page with Clerk Auth**

   - Implement the sign-in page at `src/app/(auth)/signin/page.tsx` using Clerk authentication.

9. **Add Navbar with Clerk Auth**

   - Build a navigation bar that uses `auth().userId` to display user info and add it to your `layout.tsx`.

10. **Create Clerk Webhook Endpoint**

    - In the Clerk dashboard, create a new webhook endpoint for the `user.created` event (use localtunnel for HTTPS if needed).

11. **Configure Webhook Secret**

    - Obtain the signing secret from Clerk and set it as `WEBHOOK_SECRET` in your environment variables.

12. **Implement Webhook Handler**

    - Create `src/app/api/webhook/register/route.ts` to handle Clerk webhooks and sync users to your database using Svix.

13. **Set Up Google SSO in Clerk**

    - Configure Google credentials in Clerk's SSO connections.

14. **Set Authorized Redirect URI in Google Cloud**

    - Add the authorized redirect URI from Clerk to your Google Cloud Console project.

15. **Add Google Auth to Signin**

    - Integrate Google authentication in your sign-in page using the `CustomGoogleOneTap.tsx` component.
