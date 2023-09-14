"use client";

import { bold } from "@/app/fonts";
import { ServerWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import { ActionTooltip } from "@/components/ActionTooltip";
import { AiOutlinePlus } from "react-icons/ai";
import { useModal } from "@/hooks/useModalStore";
import { IoSettings } from "react-icons/io5";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

export const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useModal();
  return (
    <div className="flex items-center justify-between py-2">
      <p className={`${bold.className} text-sm uppercase text-zinc-400`}>
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === "channels" && (
        <ActionTooltip label="New" side="right">
          <button
            onClick={() => onOpen("createChannel", { channelType })}
            className="text-zinc-400 hover:text-zinc-300 transition"
          >
            <AiOutlinePlus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip label="Manage" side="right">
          <button
            onClick={() => onOpen("members", { server })}
            className="text-zinc-400 hover:text-zinc-300 transition"
          >
            <IoSettings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};
