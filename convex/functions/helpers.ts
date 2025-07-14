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

    const user = await getCurrentUser(ctx);
    console.log(
      "🔍 getCurrentUser result:",
      user ? "✅ Found user" : "❌ No user"
    );

    // Fix: throw error when user is NOT found (when !user)
    if (!user) {
      console.log("❌ No user found - throwing Unauthorized");
      throw new Error("Unauthorized");
    }

    console.log("✅ User authenticated:", user._id);
    return { user };
  })
);

export const authenticatedMutation = customMutation(
  mutation,
  customCtx(async (ctx) => {
    console.log("🔍 authenticatedMutation - Starting auth check");

    const user = await getCurrentUser(ctx);
    console.log(
      "🔍 getCurrentUser result:",
      user ? "✅ Found user" : "❌ No user"
    );

    // Fix: throw error when user is NOT found (when !user)
    if (!user) {
      console.log("❌ No user found - throwing Unauthorized");
      throw new Error("Unauthorized");
    }

    console.log("✅ User authenticated:", user._id);
    return { user };
  })
);
