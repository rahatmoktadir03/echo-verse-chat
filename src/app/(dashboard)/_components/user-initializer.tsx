"use client";

import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function UserInitializer({ children }: { children: React.ReactNode }) {
  const user = useQuery(api.functions.user.get);
  const createUser = useMutation(api.functions.user.create);

  useEffect(() => {
    // If user query returns null (user authenticated but not in database), create them
    if (user === null) {
      console.log("🔄 User not found in database, creating...");
      createUser()
        .then(() => {
          console.log("✅ User created successfully");
        })
        .catch((error) => {
          console.error("❌ Failed to create user:", error);
        });
    }
  }, [user, createUser]);

  // Show loading while user status is being determined
  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show creating user state
  if (user === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Setting up your account...</p>
        </div>
      </div>
    );
  }

  // User exists, render children
  return <>{children}</>;
}
