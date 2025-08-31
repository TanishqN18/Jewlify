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
        await axios.post("/api/users", {
          email: user.emailAddresses[0].emailAddress,
          name: user.fullName,
          image: user.imageUrl,
          clerkId: user.id,
        });
      } catch (err) {
        console.error("User sync failed:", err);
      }
    };

    syncUser();
  }, [isSignedIn, user]);

  return null;
}
