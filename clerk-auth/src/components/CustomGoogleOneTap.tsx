"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Script from "next/script";
import React, { useEffect } from "react";

// Add clerk to Window to avoid type errors
declare global {
  interface Window {
    google: any;
  }
}

export function CustomGoogleOneTap() {
  const clerk = useClerk();
  const router = useRouter();

  useEffect(() => {
    // Will show the One Tap UI after two seconds
    const timeout = setTimeout(() => oneTap(), 2000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const oneTap = () => {
    const { google } = window;
    if (google) {
      google.accounts.id.initialize({
        // Add your Google Client ID here.
        client_id: process.env.GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          // Here we call our provider with the token provided by Google
          call(response.credential);
        },
      });

      // Uncomment below to show the One Tap UI without
      // logging any notifications.
      // return google.accounts.id.prompt() // without listening to notification

      // Display the One Tap UI, and log any errors that occur.
      return google.accounts.id.prompt((notification: any) => {
        console.log("Notification ::", notification);
        if (notification.isNotDisplayed()) {
          console.log(
            "getNotDisplayedReason ::",
            notification.getNotDisplayedReason()
          );
        } else if (notification.isSkippedMoment()) {
          console.log("getSkippedReason  ::", notification.getSkippedReason());
        } else if (notification.isDismissedMoment()) {
          console.log(
            "getDismissedReason ::",
            notification.getDismissedReason()
          );
        }
      });
    }
  };

  const call = async (token: any) => {
    try {
      const res = await clerk.authenticateWithGoogleOneTap({
        token,
      });

      await clerk.handleGoogleOneTapCallback(res, {
        signInFallbackRedirectUrl: "/signin",
      });
    } catch (error) {
      router.push("/signin");
    }
  };

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="beforeInteractive"
    />
  );
}
