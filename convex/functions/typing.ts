import { v } from "convex/values";
import {
  assertChannelMember,
  authenticatedMutation,
  authenticatedQuery,
} from "./helpers";
import { internalMutation } from "../_generated/server";
import { internal } from "../_generated/api";

export const list = authenticatedQuery({
  args: {
    dmOrChannelId: v.union(v.id("directMessages"), v.id("channels")),
  },
  handler: async (ctx, { dmOrChannelId }) => {
    await assertChannelMember(ctx, dmOrChannelId);
    const typingIndicators = await ctx.db
      .query("typingIndicators")
      .withIndex("by_dmOrChannelId", (q) =>
        q.eq("dmOrChannelId", dmOrChannelId)
      )
      .filter((q) => q.neq(q.field("user"), ctx.user._id))
      .collect();
    return await Promise.all(
      typingIndicators.map(async (indicator) => {
        const user = await ctx.db.get(indicator.user);
        if (!user) {
          throw new Error("User does not exist.");
        }
        return user.username;
      })
    );
  },
});

export const upsert = authenticatedMutation({
  args: {
    dmOrChannelId: v.union(v.id("directMessages"), v.id("channels")),
  },
  handler: async (ctx, { dmOrChannelId }) => {
    await assertChannelMember(ctx, dmOrChannelId);
    const existing = await ctx.db
      .query("typingIndicators")
      .withIndex("by_user_dmOrChannelId", (q) =>
        q.eq("user", ctx.user._id).eq("dmOrChannelId", dmOrChannelId)
      )
      .unique();
    const expiresAt = Date.now() + 5000;
    if (existing) {
      await ctx.db.patch(existing._id, { expiresAt });
    } else {
      await ctx.db.insert("typingIndicators", {
        user: ctx.user._id,
        dmOrChannelId,
        expiresAt,
      });
    }
    await ctx.scheduler.runAt(expiresAt, internal.functions.typing.remove, {
      dmOrChannelId,
      user: ctx.user._id,
      expiresAt,
    });
  },
});

export const remove = internalMutation({
  args: {
    dmOrChannelId: v.union(v.id("directMessages"), v.id("channels")),
    user: v.id("users"),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, { dmOrChannelId, user, expiresAt }) => {
    const existing = await ctx.db
      .query("typingIndicators")
      .withIndex("by_user_dmOrChannelId", (q) =>
        q.eq("user", user).eq("dmOrChannelId", dmOrChannelId)
      )
      .unique();
    if (existing && (!expiresAt || existing.expiresAt === expiresAt)) {
      await ctx.db.delete(existing._id);
    }
  },
});
