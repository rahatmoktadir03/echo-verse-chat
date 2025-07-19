import {
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import { mutation, query } from "../_generated/server";
import { getCurrentUser } from "./user";

export const authenticatedQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    console.log("🔍 authenticatedQuery - Starting auth check");

    // First check if user has valid Clerk session
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      console.log("❌ No Clerk identity - throwing Unauthorized");
      throw new Error("Unauthorized");
    }

    const user = await getCurrentUser(ctx);
    console.log(
      "🔍 getCurrentUser result:",
      user ? "✅ Found user" : "❌ No user"
    );

    // If user is authenticated with Clerk but not in database, they need to be created
    // This should be handled by webhooks or a separate mutation, not in a query
    if (!user) {
      console.log(
        "❌ User authenticated but not in database - needs user creation"
      );
      throw new Error(
        "User account not found. Please sign out and sign in again."
      );
    }

    console.log("✅ User authenticated:", user._id);
    return { user };
  })
);

export const authenticatedMutation = customMutation(
  mutation,
  customCtx(async (ctx) => {
    console.log("🔍 authenticatedMutation - Starting auth check");

    // First check if user has valid Clerk session
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      console.log("❌ No Clerk identity - throwing Unauthorized");
      throw new Error("Unauthorized");
    }

    const user = await getCurrentUser(ctx);
    console.log(
      "🔍 getCurrentUser result:",
      user ? "✅ Found user" : "❌ No user"
    );

    // If user is authenticated with Clerk but not in database, create them
    if (!user) {
      console.log(
        "⚠️ User authenticated but not in database, creating user..."
      );

      // Get user info from Clerk identity with proper type handling
      const username =
        typeof identity.username === "string"
          ? identity.username
          : typeof identity.email === "string"
          ? identity.email.split("@")[0]
          : "Unknown";

      const userInfo = {
        username,
        image: identity.pictureUrl || "",
        clerkId: identity.subject,
      };

      try {
        const newUserId = await ctx.db.insert("users", userInfo);
        const newUser = await ctx.db.get(newUserId);
        console.log("✅ Created new user:", newUserId);
        return { user: newUser! };
      } catch (error) {
        console.error("❌ Failed to create user:", error);
        throw new Error("Failed to create user account");
      }
    }

    console.log("✅ User authenticated:", user._id);
    return { user };
  })
);
