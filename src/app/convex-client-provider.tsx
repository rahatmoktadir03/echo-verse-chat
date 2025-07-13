"use client";

import React from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, RedirectToSignIn, useAuth } from "@clerk/nextjs";
import { MultisessionAppSupport } from "@clerk/clerk-react/internal";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

// Move client creation outside component to avoid recreation on each render
const convexClient = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const ConvexClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Add error handling for missing environment variables
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    throw new Error(
      "Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable"
    );
  }

  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    throw new Error("Missing NEXT_PUBLIC_CONVEX_URL environment variable");
  }

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
      // Remove dynamic comment or replace with actual dynamic config
    >
      <MultisessionAppSupport>
        <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
          <AuthLoading>
            <Loader />
          </AuthLoading>
          <Authenticated>{children}</Authenticated>
          <Unauthenticated>
            <RedirectToSignIn />
          </Unauthenticated>
        </ConvexProviderWithClerk>
      </MultisessionAppSupport>
    </ClerkProvider>
  );
};

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span className="ml-2">Loading...</span>
    </div>
  );
};
