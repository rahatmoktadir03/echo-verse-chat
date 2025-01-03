import { authenticatedMutation } from "./helpers";

export const generateUploadUrl = authenticatedMutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
