"use client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AddFriend } from "../dashboard/_components/add-friend";
import {
  AcceptedFriendsList,
  PendingFriendsList,
} from "../dashboard/_components/friends-list";

export default function FriendsPage() {
  return (
    <div className="flex-1 flex-col flex divide-y divide-border/50">
      <header className="flex items-center justify-between p-4 border-b border-border/50 glass-effect">
        <div>
          <h1 className="font-semibold text-lg">Friends</h1>
          <p className="text-sm text-muted-foreground mono">
            Manage your connections
          </p>
        </div>
        <AddFriend />
      </header>
      <div className="grid p-6 gap-6 bg-background/50 backdrop-blur-sm">
        <TooltipProvider delayDuration={0}>
          <PendingFriendsList />
          <AcceptedFriendsList />
        </TooltipProvider>
      </div>
    </div>
  );
}
