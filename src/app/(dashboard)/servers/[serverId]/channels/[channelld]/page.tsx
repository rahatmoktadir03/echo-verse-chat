"use client";

import { use } from "react";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { Messages } from "@/components/messages";
import { useQuery } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";

export default function ChannelPage({
  params,
}: {
  params: Promise<{ channelId: Id<"channels"> }>;
}) {
  const { channelId } = use(params);
  const channel = useQuery(api.functions.channel.get, { id: channelId });
  return (
    <div className="flex flex-1 flex-col divide-y">
      <header className="p-4">
        <h1 className="font-semibold">{channel?.name}</h1>
      </header>
      <Messages id={channelId} />
    </div>
  );
}
