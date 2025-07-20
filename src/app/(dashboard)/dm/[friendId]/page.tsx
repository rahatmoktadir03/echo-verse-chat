"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon, ArrowLeftIcon } from "lucide-react";
import { useState, use, useEffect, useRef } from "react";
import Link from "next/link";
import { Id } from "../../../../../convex/_generated/dataModel";

export default function DirectMessagePage({
  params,
}: {
  params: Promise<{ friendId: string }>;
}) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const resolvedParams = use(params);
  const friendId = resolvedParams.friendId as Id<"users">;

  const friend = useQuery(api.functions.user.getById, { id: friendId });
  const messages = useQuery(api.functions.message.getConversation, {
    friendId,
  });
  const sendMessage = useMutation(api.functions.message.send);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    setIsSending(true);
    try {
      console.log("Sending message:", message, "to:", friendId);
      await sendMessage({
        recipient: friendId,
        content: message,
      });
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!friend || messages === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b border-border/50 glass-effect">
        <Button variant="ghost" size="sm" asChild className="hover:bg-muted/50">
          <Link href="/">
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <Avatar className="h-8 w-8 ring-1 ring-border">
          <AvatarImage src={friend.image} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {friend.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="font-semibold">{friend.username}</h1>
          <p className="text-sm text-muted-foreground mono">
            online • last seen now
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-muted-foreground mono">connected</span>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-background/50 backdrop-blur-sm">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Avatar className="h-16 w-16 mx-auto mb-4 ring-2 ring-border">
              <AvatarImage src={friend.image} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {friend.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-foreground mb-2">
              Welcome to your conversation with {friend.username}
            </h3>
            <p className="text-sm mb-4">
              This is the beginning of your chat history.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/50">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs mono">
                secure connection established
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${
                  msg.isFromCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg backdrop-blur-sm border ${
                    msg.isFromCurrentUser
                      ? "bg-primary/90 text-primary-foreground border-primary/50 shadow-lg shadow-primary/20"
                      : "bg-muted/60 border-border/50 shadow-lg shadow-black/10 dark:shadow-white/5"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1 mono">
                    {new Date(msg._creationTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-sm"
      >
        <div className="flex gap-3">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message ${friend.username}...`}
            className="flex-1 bg-background/60 border-border/50 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 backdrop-blur-sm placeholder:text-muted-foreground"
          />
          <Button
            type="submit"
            disabled={!message.trim() || isSending}
            className="bg-primary/90 hover:bg-primary hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:scale-100"
          >
            {isSending ? (
              <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <SendIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span className="mono">
            Type your message and press Enter to send
          </span>
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-green-500" />
            <span className="mono">online</span>
          </div>
        </div>
      </form>
    </div>
  );
}
