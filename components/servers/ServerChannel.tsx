"use client";

import { primary } from "@/app/fonts";
import { cn } from "@/lib/utils";
import { Channel, MemberRole, Server, ChannelType } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { AiTwotoneAudio } from "react-icons/ai";
import { FaHashtag, FaVideo } from "react-icons/fa";
import { HiLockClosed } from "react-icons/hi";

import { ActionTooltip } from "@/components/ActionTooltip";
import { Edit, Trash } from "lucide-react";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const iconMap = {
  [ChannelType.TEXT]: FaHashtag,
  [ChannelType.AUDIO]: AiTwotoneAudio,
  [ChannelType.VIDEO]: FaVideo,
};

export const ServerChannel = ({
  channel,
  server,
  role,
}: ServerChannelProps) => {
  const router = useRouter();
  const params = useParams();
  const Icon = iconMap[channel.type];
  return (
    <button
      onClick={() => {}}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full bg-tertiary/40 hover:bg-tertiary/70 transition mb-1",
        params?.channelId === channel.id && "bg-secondary"
      )}
    >
      <Icon className="flex-shrink-0 h-5 w-5 text-zinc-300" />
      <p
        className={cn(
          "line-clamp-1 text-sm text-zinc-300",
          primary.className,
          params?.channelId === channel.id && "text-primary"
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit" side="top">
            <Edit className="hidden group-hover:block w-4 h-4 text-zinc-400" />
          </ActionTooltip>
          <ActionTooltip label="Delete" side="top">
            <Trash className="hidden group-hover:block w-4 h-4 text-zinc-400 transition" />
          </ActionTooltip>
        </div>
      )}
      {channel.name === "general" && (
        <HiLockClosed className="ml-auto w-4 h-4 text-zinc-400" />
      )}
    </button>
  );
};
