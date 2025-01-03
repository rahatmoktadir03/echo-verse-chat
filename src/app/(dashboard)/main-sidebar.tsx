import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreateServer } from "./create-server";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function MainSidebar() {
  const servers = useQuery(api.functions.server.list);
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Direct Messages"
                  isActive={pathname.startsWith("/dms")}
                  asChild
                >
                  <Link href="/dms">
                    <UserIcon />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {servers?.map((server) => (
                <SidebarMenuItem key={server._id}>
                  <SidebarMenuButton
                    className="group-data-[collapsible=icon]:!p-0"
                    tooltip={server.name}
                  >
                    <Link
                      href={`/servers/${server._id}/channels/${server.defaultChannelId}`}
                    >
                      <Avatar className="rounded-none">
                        {server.iconUrl && <AvatarImage src={server.iconUrl} />}
                        <AvatarFallback>{server.name[0]}</AvatarFallback>
                      </Avatar>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <CreateServer />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
