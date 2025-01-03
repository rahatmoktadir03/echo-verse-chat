import "@livekit/components-styles";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useQuery } from "convex/react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { PhoneIcon } from "lucide-react";
import { useState } from "react";

export function Voice({ serverId }: { serverId: Id<"servers"> }) {
  const token = useQuery(api.functions.livekit.getToken, { serverId });
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton>
          <PhoneIcon />
          Voice
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="max-w-screen-lg">
        <DialogTitle className="sr-only">Voice</DialogTitle>
        <LiveKitRoom
          serverUrl="wss://chatstarter-8e87019q.livekit.cloud"
          token={token}
          onDisconnected={() => setOpen(false)}
        >
          <VideoConference />
        </LiveKitRoom>
      </DialogContent>
    </Dialog>
  );
}
