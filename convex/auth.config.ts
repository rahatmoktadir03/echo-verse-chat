export default {
  providers: [
    {
      domain:
        process.env.CLERK_ISSUER_URL ||
        "https://super-escargot-46.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};
