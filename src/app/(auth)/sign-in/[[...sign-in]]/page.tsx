import { SignIn } from "@clerk/nextjs";
import React from "react";

export default function Page() {
  return (
    <SignIn
      routing="path"
      path="/sign-in"
      redirectUrl="/dashboard"
      signUpUrl="/sign-up"
      appearance={{
        elements: {
          rootBox: "mx-auto",
          card: "bg-transparent shadow-none",
        },
      }}
    />
  );
}
