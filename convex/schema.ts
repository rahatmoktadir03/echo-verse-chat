import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    image: v.string(),
    clerkId: v.string(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_username", ["username"]),
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
  directMessages: defineTable({}),
  directMessageMembers: defineTable({
    directMessage: v.id("directMessages"),
    user: v.id("users"),
  })
    .index("by_direct_message", ["directMessage"])
    .index("by_direct_message_user", ["directMessage", "user"])
    .index("by_user", ["user"]),

  servers: defineTable({
    name: v.string(),
    ownerId: v.id("users"),
    iconId: v.optional(v.id("_storage")),
    defaultChannelId: v.optional(v.id("channels")),
  }),
  channels: defineTable({
    name: v.string(),
    serverId: v.id("servers"),
  })
    .index("by_serverId", ["serverId"])
    .index("by_serverId_name", ["serverId", "name"]),
  serverMembers: defineTable({
    serverId: v.id("servers"),
    userId: v.id("users"),
  })
    .index("by_serverId", ["serverId"])
    .index("by_userId", ["userId"])
    .index("by_serverId_userId", ["serverId", "userId"]),
  invites: defineTable({
    serverId: v.id("servers"),
    expiresAt: v.optional(v.number()),
    maxUses: v.optional(v.number()),
    uses: v.number(),
  }),

  messages: defineTable({
    sender: v.id("users"),
    content: v.string(),
    dmOrChannelId: v.union(v.id("directMessages"), v.id("channels")),
    attachment: v.optional(v.id("_storage")),
  }).index("by_dmOrChannelId", ["dmOrChannelId"]),
  typingIndicators: defineTable({
    user: v.id("users"),
    dmOrChannelId: v.union(v.id("directMessages"), v.id("channels")),
    expiresAt: v.number(),
  })
    .index("by_dmOrChannelId", ["dmOrChannelId"])
    .index("by_user_dmOrChannelId", ["user", "dmOrChannelId"]),
});
