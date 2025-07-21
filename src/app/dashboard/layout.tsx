"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RedirectToSignIn } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { DashboardSidebar } from "../(dashboard)/_components/sidebar";
import { UserInitializer } from "../(dashboard)/_components/user-initializer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Authenticated>
        <UserInitializer>
          <SidebarProvider>
            <DashboardSidebar />
            {children}
          </SidebarProvider>
        </UserInitializer>
      </Authenticated>
      <Unauthenticated>
        <RedirectToSignIn />
      </Unauthenticated>
    </>
  );
}
