"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "../../../../convex/_generated/api";
import { Dialog } from "@radix-ui/react-dialog";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { catchError } from "@/lib/utils";
export function AddFriend() {
  const [open, setOpen] = useState(false);
  const createFriendRequest = useMutation(
    api.functions.friend.createFriendRequest
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = e.currentTarget.username.value;

    const [error] = await catchError(createFriendRequest({ username }));

    if (error) {
      toast.error("Failed to send friend request", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      return;
    }

    toast.success("Friend request sent");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-primary/90 hover:bg-primary hover:scale-105 transition-all duration-200"
        >
          + Add Friend
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-effect border-border/50">
        <DialogHeader>
          <DialogTitle className="text-lg">Add Friend</DialogTitle>
          <DialogDescription className="mono text-muted-foreground">
            Connect with friends by entering their username
          </DialogDescription>
        </DialogHeader>
        <form className="contents" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="username" className="text-sm font-medium mono">
              USERNAME
            </Label>
            <Input
              id="username"
              type="text"
              required
              placeholder="Enter username..."
              className="bg-background/60 border-border/50 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 backdrop-blur-sm"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button className="bg-primary/90 hover:bg-primary">
              Send Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
