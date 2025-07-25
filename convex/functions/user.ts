import {
  internalMutation,
  MutationCtx,
  mutation,
  query,
  QueryCtx,
} from "../_generated/server";
import { v } from "convex/values";

export const get = query({
  handler: async (ctx) => {
    try {
      console.log("🔍 Getting user");

      // Check auth first
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        console.log("❌ No identity found");
        return null;
      }

      const user = await getCurrentUser(ctx);
      console.log("🔍 User result:", user ? "✅ Found" : "❌ Not found");

      // Cannot create user in a query - this should be handled by webhooks or mutations
      if (!user && identity) {
        console.log(
          "⚠️ User authenticated but not in database - needs user creation"
        );
        return null; // Return null instead of trying to create user in query
      }

      return user;
    } catch (error) {
      console.error("❌ Error getting user:", error);
      throw new Error(
        `${
          error instanceof Error ? error.message : `Unknown error @${get.name}`
        }`
      );
    }
  },
});

export const getById = query({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, args) => {
    try {
      console.log("🔍 Getting user by ID:", args.id);
      const user = await ctx.db.get(args.id);
      console.log("🔍 User result:", user ? "✅ Found" : "❌ Not found");
      return user;
    } catch (error) {
      console.error("❌ Error getting user by ID:", error);
      return null;
    }
  },
});

export const create = mutation({
  handler: async (ctx) => {
    try {
      console.log("🔍 Creating user from authenticated session");

      // Check auth first
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        console.log("❌ No identity found");
        throw new Error("Unauthorized");
      }

      // Check if user already exists
      const existingUser = await getUserByClerkId(ctx, identity.subject);
      if (existingUser) {
        console.log("✅ User already exists:", existingUser._id);
        return existingUser;
      }

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

      const newUserId = await ctx.db.insert("users", userInfo);
      const newUser = await ctx.db.get(newUserId);
      console.log("✅ Created new user:", newUserId);
      return newUser;
    } catch (error) {
      console.error("❌ Error creating user:", error);
      throw error;
    }
  },
});

export const upsert = internalMutation({
  args: {
    username: v.string(),
    image: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      console.log("🔍 Upserting user with clerkId:", args.clerkId);

      const user = await getUserByClerkId(ctx, args.clerkId);

      if (user) {
        console.log("✅ User exists, updating:", user._id);
        await ctx.db.patch(user._id, {
          username: args.username,
          image: args.image,
        });
      } else {
        console.log("✅ User doesn't exist, creating new user");
        await ctx.db.insert("users", {
          username: args.username,
          image: args.image,
          clerkId: args.clerkId,
        });
      }
    } catch (error) {
      console.error("❌ Error upserting user:", error);
      throw error;
    }
  },
});

export const remove = internalMutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      console.log("🔍 Removing user with clerkId:", args.clerkId);

      const user = await getUserByClerkId(ctx, args.clerkId);
      if (user) {
        console.log("✅ User found, deleting:", user._id);
        await ctx.db.delete(user._id);
      } else {
        console.log("⚠️ User not found for deletion");
      }
    } catch (error) {
      console.error("❌ Error removing user:", error);
      throw error;
    }
  },
});

// Get current authenticated user
export const getCurrentUser = async (ctx: QueryCtx | MutationCtx) => {
  try {
    const identity = await ctx.auth.getUserIdentity();
    console.log("🔍 Auth identity:", identity ? "✅ Found" : "❌ Not found");

    if (!identity) {
      console.log("❌ No identity found - user not authenticated");
      return null;
    }

    console.log("🔍 Looking up user by clerkId:", identity.subject);
    const user = await getUserByClerkId(ctx, identity.subject);
    console.log("🔍 User from database:", user ? "✅ Found" : "❌ Not found");

    if (!user) {
      console.log("⚠️ User authenticated but not found in database");
    }

    return user;
  } catch (error) {
    console.error("❌ Error in getCurrentUser:", error);
    // Return null instead of throwing to prevent auth loops
    return null;
  }
};

// Get user by Clerk ID
export const getUserByClerkId = async (
  ctx: QueryCtx | MutationCtx,
  clerkId: string
) => {
  try {
    console.log("🔍 Querying user by clerkId:", clerkId);

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .unique();

    console.log(
      "🔍 Query result:",
      user ? "✅ Found user" : "❌ No user found"
    );
    return user;
  } catch (error) {
    console.error("❌ Error querying user by clerkId:", error);
    throw error;
  }
};

// Helper function to get user by username (for friend requests)
export const getUserByUsername = async (
  ctx: QueryCtx | MutationCtx,
  username: string
) => {
  try {
    console.log("🔍 Querying user by username:", username);

    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();

    console.log(
      "🔍 Query result:",
      user ? "✅ Found user" : "❌ No user found"
    );
    return user;
  } catch (error) {
    console.error("❌ Error querying user by username:", error);
    throw error;
  }
};
