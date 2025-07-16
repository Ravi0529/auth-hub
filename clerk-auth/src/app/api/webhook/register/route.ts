import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error("Please add webhook secret in env");
  }

  const headerPayload = headers();
  const svix_id = (await headerPayload).get("svix-id");
  const svix_timestamp = (await headerPayload).get("svix-timestamp");
  const svix_signature = (await headerPayload).get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing Svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return new Response("Verification failed", {
      status: 400,
    });
  }

  if (evt.type === "user.created") {
    const { id, username, email_addresses, primary_email_address_id } =
      evt.data;

    const primaryEmail = email_addresses.find(
      (email) => email.id === primary_email_address_id
    );

    if (!primaryEmail) {
      return new Response("No primary email found", {
        status: 400,
      });
    }

    try {
      const client = clerkClient();
      (await client).users.getUser(id);

      const existingUser = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!existingUser) {
        const usernameToSave =
          username ?? primaryEmail.email_address.split("@")[0];

        const newUser = await prisma.user.create({
          data: {
            id: id,
            username: usernameToSave,
            email: primaryEmail.email_address,
          },
        });

        console.log("New user created in DB:", newUser);
      }
    } catch (error) {
      console.error("Error creating user in DB or syncing metadata", error);
      return new Response("Error handling user.created", {
        status: 500,
      });
    }

    return new Response("User processed successfully", {
      status: 200,
    });
  }

  return new Response("Event type not handled", {
    status: 200,
  });
}
