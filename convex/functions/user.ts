import {
  internalMutation,
  MutationCtx,
  query,
  QueryCtx,
} from "../_generated/server";
import { v } from "convex/values";

export const get = query({
  handler: async (ctx) => {
    try {
      console.log("getting user");
      console.log(await getCurrentUser(ctx));
      return await getCurrentUser(ctx);
    } catch (error) {
      console.error("Error getting user: ", error);
      throw new Error(
        `${
          error instanceof Error ? error.message : `Unknown error @${get.name}`
        }`
      );
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
    const user = await getUserByClerkId(ctx, args.clerkId);

    if (user) {
      await ctx.db.patch(user._id, {
        username: args.username,
        image: args.image,
      });
    } else {
      await ctx.db.insert("users", {
        username: args.username,
        image: args.image,
        clerkId: args.clerkId,
      });
    }
  },
});

export const remove = internalMutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getUserByClerkId(ctx, args.clerkId);
    if (user) {
      await ctx.db.delete(user._id);
    }
  },
});

// FIXED: Return null instead of throwing when no identity
export const getCurrentUser = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  console.log("🔍 identity", identity);

  if (!identity) {
    console.log("❌ No identity found");
    return null; // Return null instead of throwing
  }

  const user = await getUserByClerkId(ctx, identity.subject);
  console.log("🔍 user from database", user);

  return user;
};

export const getUserByClerkId = (
  ctx: QueryCtx | MutationCtx,
  clerkId: string
) => {
  console.log("🔍 clerkId", clerkId);
  return ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
    .unique();
};
