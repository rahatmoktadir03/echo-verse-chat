import { Id } from "../_generated/dataModel";
import { authenticatedMutation, authenticatedQuery } from "./helpers";
import { getUserByUsername } from "./user";
import { v } from "convex/values";

export const listPending = authenticatedQuery({
  handler: async (ctx) => {
    console.log("🔍 listPending - Starting query");
    console.log("🔍 User ID:", ctx.user._id);

    try {
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
    } catch (error) {
      console.error("❌ Error in listPending:", error);
      throw error;
    }
  },
});

export const listAccepted = authenticatedQuery({
  handler: async (ctx) => {
    console.log("🔍 listAccepted - Starting query");
    console.log("🔍 User ID:", ctx.user._id);

    try {
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
    } catch (error) {
      console.error("❌ Error in listAccepted:", error);
      throw error;
    }
  },
});

export const createFriendRequest = authenticatedMutation({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    console.log("🔍 createFriendRequest - Starting");
    console.log("🔍 Looking for username:", username);

    try {
      const user = await getUserByUsername(ctx, username);

      if (!user) {
        console.log("❌ User not found:", username);
        throw new Error("User not found");
      }

      if (user._id === ctx.user._id) {
        console.log("❌ Cannot add yourself");
        throw new Error("Cannot add yourself");
      }

      // Check if friendship already exists
      const existingFriend = await ctx.db
        .query("friends")
        .filter((q) =>
          q.or(
            q.and(
              q.eq(q.field("user1"), ctx.user._id),
              q.eq(q.field("user2"), user._id)
            ),
            q.and(
              q.eq(q.field("user1"), user._id),
              q.eq(q.field("user2"), ctx.user._id)
            )
          )
        )
        .unique();

      if (existingFriend) {
        console.log("❌ Friendship already exists");
        throw new Error("Friendship already exists");
      }

      console.log("✅ Creating friend request");
      await ctx.db.insert("friends", {
        user1: ctx.user._id,
        user2: user._id,
        status: "pending",
      });

      console.log("✅ Friend request created");
    } catch (error) {
      console.error("❌ Error in createFriendRequest:", error);
      throw error;
    }
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

    try {
      const friend = await ctx.db.get(id);
      if (!friend) {
        console.log("❌ Friend not found");
        throw new Error("Friend not found");
      }

      // Only the recipient (user2) can accept/reject friend requests
      if (friend.user2 !== ctx.user._id) {
        console.log("❌ Unauthorized - only recipient can update status");
        throw new Error("Unauthorized");
      }

      console.log("✅ Updating friend status");
      await ctx.db.patch(id, { status });
      console.log("✅ Friend status updated");
    } catch (error) {
      console.error("❌ Error in updateStatus:", error);
      throw error;
    }
  },
});

const mapWithUsers = async <
  K extends string,
  T extends { [key in K]: Id<"users"> }
>(
  ctx: any, // Using any to avoid complex generic type issues
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
    .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
    .map((r) => r.value);

  console.log(
    "🔍 mapWithUsers - Successful results:",
    successfulResults.length
  );

  return successfulResults;
};
