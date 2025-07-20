import { mutation, query } from "../_generated/server";
import { authenticatedMutation, authenticatedQuery } from "./helpers";
import { v } from "convex/values";

// Send a message to another user
export const send = authenticatedMutation({
  args: {
    recipient: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("📤 Sending message from", ctx.user._id, "to", args.recipient);

    // Insert the message
    const messageId = await ctx.db.insert("messages", {
      sender: ctx.user._id,
      recipient: args.recipient,
      content: args.content.trim(),
    });

    console.log("✅ Message sent:", messageId);
    return messageId;
  },
});

// Get messages between current user and another user
export const getConversation = authenticatedQuery({
  args: {
    friendId: v.id("users"),
  },
  handler: async (ctx, args) => {
    console.log(
      "💬 Getting conversation between",
      ctx.user._id,
      "and",
      args.friendId
    );

    // Get messages where current user is sender and friend is recipient
    const sentMessages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("sender", ctx.user._id).eq("recipient", args.friendId)
      )
      .collect();

    // Get messages where friend is sender and current user is recipient
    const receivedMessages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("sender", args.friendId).eq("recipient", ctx.user._id)
      )
      .collect();

    // Combine and sort by creation time
    const allMessages = [...sentMessages, ...receivedMessages].sort(
      (a, b) => a._creationTime - b._creationTime
    );

    console.log("📬 Found", allMessages.length, "messages in conversation");

    // Add sender info to each message
    const messagesWithSender = await Promise.all(
      allMessages.map(async (message) => {
        const sender = await ctx.db.get(message.sender);
        return {
          ...message,
          senderInfo: sender,
          isFromCurrentUser: message.sender === ctx.user._id,
        };
      })
    );

    return messagesWithSender;
  },
});
