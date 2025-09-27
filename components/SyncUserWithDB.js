"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

export default function SyncUserWithDB() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn || !user) return;

    const syncUser = async () => {
      try {
        await axios.post("/api/sync-user", {
          email: user.emailAddresses[0]?.emailAddress,
          name: user.fullName || user.firstName + " " + user.lastName,
          image: user.imageUrl,
          clerkId: user.id,
        });
        console.log("User sync completed successfully");
      } catch (err) {
        console.error("User sync failed:", err);
      }
    };

    syncUser();
  }, [isSignedIn, user]);

  return null;
}
