import { Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import { authenticatedMutation, authenticatedQuery } from "./helpers";
import { v } from "convex/values";

export const listPending = authenticatedQuery({
  handler: async (ctx) => {
    console.log("🔍 listPending - Starting query");
    console.log("🔍 User ID:", ctx.user._id);

    const friends = await ctx.db
      .query("friends")
      .withIndex("by_user2_status", (q) =>
        q.eq("user2", ctx.user._id).eq("status", "pending")
      )
      .collect();

    console.log("🔍 Found pending friends:", friends.length);

    const result = await mapWithUsers(ctx, friends, "user1");
    console.log("🔍 Mapped result:", result.length);

    return result;
  },
});

export const listAccepted = authenticatedQuery({
  handler: async (ctx) => {
    console.log("🔍 listAccepted - Starting query");
    console.log("🔍 User ID:", ctx.user._id);

    const friends1 = await ctx.db
      .query("friends")
      .withIndex("by_user1_status", (q) =>
        q.eq("user1", ctx.user._id).eq("status", "accepted")
      )
      .collect();

    const friends2 = await ctx.db
      .query("friends")
      .withIndex("by_user2_status", (q) =>
        q.eq("user2", ctx.user._id).eq("status", "accepted")
      )
      .collect();

    console.log("🔍 Friends1 count:", friends1.length);
    console.log("🔍 Friends2 count:", friends2.length);

    const friendsWithUser1 = await mapWithUsers(ctx, friends1, "user2");
    const friendsWithUser2 = await mapWithUsers(ctx, friends2, "user1");

    const result = [...friendsWithUser1, ...friendsWithUser2];
    console.log("🔍 Total accepted friends:", result.length);

    return result;
  },
});

export const createFriendRequest = authenticatedMutation({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    console.log("🔍 createFriendRequest - Starting");
    console.log("🔍 Looking for username:", username);

    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();

    if (!user) {
      console.log("❌ User not found:", username);
      throw new Error("User not found");
    } else if (user._id === ctx.user._id) {
      console.log("❌ Cannot add yourself");
      throw new Error("Cannot add yourself");
    }

    console.log("✅ Creating friend request");
    await ctx.db.insert("friends", {
      user1: ctx.user._id,
      user2: user._id,
      status: "pending",
    });

    console.log("✅ Friend request created");
  },
});

export const updateStatus = authenticatedMutation({
  args: {
    id: v.id("friends"),
    status: v.union(v.literal("accepted"), v.literal("rejected")),
  },
  handler: async (ctx, { id, status }) => {
    console.log("🔍 updateStatus - Starting");
    console.log("🔍 Friend ID:", id);
    console.log("🔍 New status:", status);

    const friend = await ctx.db.get(id);
    if (!friend) {
      console.log("❌ Friend not found");
      throw new Error("Friend not found");
    }

    if (friend.user1 !== ctx.user._id && friend.user2 !== ctx.user._id) {
      console.log("❌ Unauthorized - user not part of friendship");
      throw new Error("Unauthorized");
    }

    console.log("✅ Updating friend status");
    await ctx.db.patch(id, { status });
    console.log("✅ Friend status updated");
  },
});

const mapWithUsers = async <
  K extends string,
  T extends { [key in K]: Id<"users"> }
>(
  ctx: QueryCtx,
  items: T[],
  key: K
) => {
  console.log("🔍 mapWithUsers - Processing", items.length, "items");

  const result = await Promise.allSettled(
    items.map(async (item) => {
      const user = await ctx.db.get(item[key]);
      if (!user) {
        console.log("❌ User not found for ID:", item[key]);
        throw new Error("User not found");
      }
      return {
        ...item,
        user,
      };
    })
  );

  const successfulResults = result
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);
  console.log(
    "🔍 mapWithUsers - Successful results:",
    successfulResults.length
  );

  return successfulResults;
};
