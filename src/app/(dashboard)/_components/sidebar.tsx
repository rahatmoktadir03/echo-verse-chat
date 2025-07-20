"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { api } from "../../../../convex/_generated/api";
import { SignOutButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import {
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Zap,
  User,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function DashboardSidebar() {
  const user = useQuery(api.functions.user.get);
  const friends = useQuery(api.functions.friend.listAccepted);

  if (!user) {
    return null;
  }

  return (
    <Sidebar className="glass-effect">
      <SidebarHeader className="border-b border-border/50">
        <div className="flex items-center gap-2 p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary glow">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight">EchoVerse</span>
            <span className="text-xs text-muted-foreground mono">v1.0.0</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="group">
                  <Link href="/" className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 group-hover:text-primary transition-colors" />
                    <span>Direct Messages</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="group">
                  <Link href="/friends" className="flex items-center gap-3">
                    <Users className="h-4 w-4 group-hover:text-primary transition-colors" />
                    <span>Friends</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground mono">
            ACTIVE_CONVERSATIONS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {friends?.slice(0, 5).map((friend) => (
                <SidebarMenuItem key={friend._id}>
                  <SidebarMenuButton asChild className="group">
                    <Link
                      href={`/dm/${friend.user._id}`}
                      className="flex items-center gap-3"
                    >
                      <Avatar className="h-5 w-5 ring-1 ring-border">
                        <AvatarImage src={friend.user.image} />
                        <AvatarFallback className="text-xs bg-muted">
                          {friend.user.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate group-hover:text-primary transition-colors">
                        {friend.user.username}
                      </span>
                      <div className="ml-auto h-2 w-2 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {(!friends || friends.length === 0) && (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>
                    <span className="text-muted-foreground text-sm mono">
                      No active conversations
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/50">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex items-center justify-between p-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton className="flex items-center gap-3 flex-1">
                        <Avatar className="h-6 w-6 ring-1 ring-border">
                          <AvatarImage src={user.image} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start">
                          <p className="font-medium text-sm">{user.username}</p>
                          <p className="text-xs text-muted-foreground mono">
                            online
                          </p>
                        </div>
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuItem className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        asChild
                        className="flex items-center gap-2 text-destructive"
                      >
                        <SignOutButton>
                          <div className="flex items-center gap-2">
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                          </div>
                        </SignOutButton>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <ThemeToggle />
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
