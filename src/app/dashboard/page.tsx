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

      <main className="flex-1 overflow-auto">
        {!friends?.length ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <MessageCircleIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No conversations yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start connecting with friends to begin your conversations.
            </p>
            <Link
              href="/friends"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Find Friends
            </Link>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {friends?.map((friend) => (
              <Link
                key={friend._id}
                href={`/dm/${friend.user._id}`}
                className="flex items-center space-x-3 p-4 rounded-lg hover:bg-muted/50 transition-colors border border-border/30 card-hover"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={friend.user.image} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-medium">
                    {friend.user.username?.[0]?.toUpperCase() ??
                      friend.user.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">
                      {friend.user.username ?? friend.user.email}
                    </h3>
                    <span className="text-xs text-muted-foreground mono">
                      {/* You can add last message time here */}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {friend.user.email}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <MessageCircleIcon className="w-5 h-5 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
