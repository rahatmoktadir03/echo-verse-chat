import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  method: "POST",
  path: "/clerk-webhook",
  handler: httpAction(async (ctx, req) => {
    const body = await validateRequest(req);
    if (!body) {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      switch (body.type) {
        case "user.created":
          console.log("📝 Creating user from webhook:", body.data.id);
          await ctx.runMutation(internal.functions.user.upsert, {
            username:
              body.data.username ||
              body.data.email_addresses?.[0]?.email_address?.split("@")[0] ||
              "Unknown",
            image: body.data.image_url || "",
            clerkId: body.data.id,
          });
          break;
        case "user.updated":
          console.log("📝 Updating user from webhook:", body.data.id);
          await ctx.runMutation(internal.functions.user.upsert, {
            username:
              body.data.username ||
              body.data.email_addresses?.[0]?.email_address?.split("@")[0] ||
              "Unknown",
            image: body.data.image_url || "",
            clerkId: body.data.id,
          });
          break;
        case "user.deleted":
          if (body.data.id) {
            console.log("🗑️ Deleting user from webhook:", body.data.id);
            await ctx.runMutation(internal.functions.user.remove, {
              clerkId: body.data.id,
            });
          }
          break;
        default:
          console.log("⚠️ Unhandled webhook event type:", body.type);
          break;
      }
      return new Response("OK", { status: 200 });
    } catch (error) {
      console.error("❌ Webhook processing error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }),
});

const validateRequest = async (req: Request) => {
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Request missing svix headers", { status: 400 });
  }

  const text = await req.text();

  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET! as string);
    return wh.verify(text, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as unknown as WebhookEvent;
  } catch (error) {
    return new Response(
      `${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 400 }
    );
  }
};

export default http;
