"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckIcon, MessageCircleIcon, XIcon } from "lucide-react";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function PendingFriendsList() {
  const friends = useQuery(api.functions.friend.listPending);
  const updateStatus = useMutation(api.functions.friend.updateStatus);

  // Handle loading state
  if (friends === undefined) {
    return (
      <div className="flex flex-col divide-y">
        <h2 className="text-xs font-medium text-muted-foreground p-2.5">
          Pending Friends
        </h2>
        <FriendsListEmpty>Loading friend requests...</FriendsListEmpty>
      </div>
    );
  }

  // Handle error state - friends will be null if query failed
  if (friends === null) {
    return (
      <div className="flex flex-col divide-y">
        <h2 className="text-xs font-medium text-muted-foreground p-2.5">
          Pending Friends
        </h2>
        <FriendsListEmpty>
          Unable to load friend requests. Please try refreshing the page.
        </FriendsListEmpty>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xs font-medium text-muted-foreground mono uppercase tracking-wider">
          PENDING REQUESTS
        </h2>
        <div className="h-px flex-1 bg-border/50" />
        {friends.length > 0 && (
          <span className="text-xs text-muted-foreground mono">
            {friends.length}
          </span>
        )}
      </div>
      {friends.length === 0 && (
        <FriendsListEmpty>
          No pending friend requests at the moment
        </FriendsListEmpty>
      )}
      <div className="space-y-2">
        {friends.map((friend, index) => (
          <FriendItem
            key={friend._id}
            username={friend.user.username}
            image={friend.user.image}
          >
            <IconButton
              title="Accept"
              icon={<CheckIcon />}
              className="bg-green-500/10 border-green-500/20 hover:bg-green-500/20 text-green-600 dark:text-green-400"
              onClick={() =>
                updateStatus({ id: friend._id, status: "accepted" })
              }
            />
            <IconButton
              title="Reject"
              icon={<XIcon />}
              className="bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-600 dark:text-red-400"
              onClick={() =>
                updateStatus({ id: friend._id, status: "rejected" })
              }
            />
          </FriendItem>
        ))}
      </div>
    </div>
  );
}

export function AcceptedFriendsList() {
  const friends = useQuery(api.functions.friend.listAccepted);
  const updateStatus = useMutation(api.functions.friend.updateStatus);
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xs font-medium text-muted-foreground mono uppercase tracking-wider">
          ACTIVE CONNECTIONS
        </h2>
        <div className="h-px flex-1 bg-border/50" />
        {friends && friends.length > 0 && (
          <span className="text-xs text-muted-foreground mono">
            {friends.length} online
          </span>
        )}
      </div>
      {friends?.length == 0 && (
        <FriendsListEmpty>
          Connect with friends to start chatting
        </FriendsListEmpty>
      )}
      <div className="space-y-2">
        {friends?.map((friend, index) => (
          <FriendItem
            key={friend._id}
            username={friend.user.username}
            image={friend.user.image}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="rounded-full bg-primary/10 border-primary/20 hover:bg-primary/20 text-primary"
                  variant="outline"
                  size="icon"
                  asChild
                >
                  <Link href={`/dm/${friend.user._id}`}>
                    <MessageCircleIcon />
                    <span className="sr-only">Start DM</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Start conversation</TooltipContent>
            </Tooltip>
            <IconButton
              title="Remove Friend"
              icon={<XIcon />}
              className="bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-600 dark:text-red-400"
              onClick={() =>
                updateStatus({ id: friend._id, status: "rejected" })
              }
            />
          </FriendItem>
        ))}
      </div>
    </div>
  );
}

function FriendsListEmpty({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 bg-muted/30 border border-border/50 rounded-lg text-center">
      <div className="relative mx-auto h-8 w-8 mb-3">
        <div className="h-8 w-8 rounded-full bg-muted-foreground/10" />
        <div className="absolute inset-0 h-8 w-8 border border-muted-foreground/20 rounded-full animate-pulse" />
      </div>
      <p className="text-sm text-muted-foreground mono">{children}</p>
    </div>
  );
}

function IconButton({
  title,
  className,
  icon,
  onClick,
}: {
  title: string;
  className?: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn("rounded-full", className)}
          variant="outline"
          size="icon"
          onClick={onClick}
        >
          {icon}
          <span className="sr-only">{title}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{title}</TooltipContent>
    </Tooltip>
  );
}

function FriendItem({
  username,
  image,
  children,
}: {
  username: string;
  image: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-background/60 backdrop-blur-sm hover:bg-muted/50 hover:border-primary/30 transition-all duration-200 group">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 ring-1 ring-border group-hover:ring-primary/50 transition-all">
          <AvatarImage src={image} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium group-hover:text-primary transition-colors">
            {username}
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <div className="h-1 w-1 rounded-full bg-green-500" />
            <span className="mono">online</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
