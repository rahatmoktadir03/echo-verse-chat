"use client";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircleIcon } from "lucide-react";

export default function DashboardPage() {
  const friends = useQuery(api.functions.friend.listAccepted);

  return (
    <div className="flex-1 flex-col flex divide-y divide-border/50">
      <header className="flex items-center justify-between p-4 border-b border-border/50 glass-effect">
        <div>
          <h1 className="font-semibold text-lg">Direct Messages</h1>
          <p className="text-sm text-muted-foreground mono">
            Your conversations
          </p>
        </div>
      </header>
      <div className="flex-1 p-6 bg-background/50 backdrop-blur-sm">
        {!friends || friends.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <div className="relative mx-auto h-16 w-16 mb-6">
              <MessageCircleIcon className="h-16 w-16 opacity-20" />
              <div className="absolute inset-0 h-16 w-16 border-2 border-primary/20 rounded-full animate-pulse" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              No conversations yet
            </h3>
            <p className="text-sm mb-4">
              Start your first conversation by adding friends!
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors">
              <Link
                href="/friends"
                className="text-primary font-medium text-sm"
              >
                Go to Friends →
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-sm font-medium text-muted-foreground mono">
                ACTIVE CONNECTIONS
              </h2>
              <div className="h-px flex-1 bg-border/50" />
              <span className="text-xs text-muted-foreground mono">
                {friends.length} online
              </span>
            </div>
            {friends.map((friend) => (
              <Link
                key={friend._id}
                href={`/dm/${friend.user._id}`}
                className="flex items-center gap-3 p-4 rounded-lg border border-border/50 bg-background/60 hover:bg-muted/50 hover:border-primary/50 transition-all duration-200 group backdrop-blur-sm"
              >
                <Avatar className="h-10 w-10 ring-1 ring-border group-hover:ring-primary/50 transition-all">
                  <AvatarImage src={friend.user.image} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {friend.user.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium group-hover:text-primary transition-colors">
                    {friend.user.username}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    <span className="mono">online • ready to chat</span>
                  </div>
                </div>
                <MessageCircleIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
