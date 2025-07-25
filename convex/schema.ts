import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    image: v.string(),
    clerkId: v.string(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_username", ["username"]), // Index for friend requests

  friends: defineTable({
    user1: v.id("users"),
    user2: v.id("users"),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("rejected")
    ),
  })
    .index("by_user1_status", ["user1", "status"])
    .index("by_user2_status", ["user2", "status"]),

  messages: defineTable({
    sender: v.id("users"),
    recipient: v.id("users"),
    content: v.string(),
  })
    .index("by_sender", ["sender"])
    .index("by_recipient", ["recipient"])
    .index("by_conversation", ["sender", "recipient"]),
});
