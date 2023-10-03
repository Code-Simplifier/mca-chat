"use client";

import { Member, MemberRole, Profile } from "@prisma/client";
import { UserAvatar } from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import { bold, code, primary } from "@/app/fonts";
import { ActionTooltip } from "@/components/ActionTooltip";

import { FaChalkboardTeacher } from "react-icons/fa";
import { BsShieldFillCheck } from "react-icons/bs";
import Image from "next/image";
import { useState } from "react";

interface ChatItemProps {
  id: string;
  content: string;
  timestamp: string;
  socketUrl: string;
  deleted: boolean;
  isUpdated: boolean;
  fileUrl: string | null;
  socketQuery: Record<string, string>;
  currentMember: Member;
  member: Member & { profile: Profile };
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <FaChalkboardTeacher className="h-4 w-4 text-rose-400" />,
  ADMIN: <BsShieldFillCheck className="h-4 w-4 text-secondary" />,
};

const ChatItem = ({
  id,
  content,
  timestamp,
  socketQuery,
  socketUrl,
  deleted,
  isUpdated,
  fileUrl,
  currentMember,
  member,
}: ChatItemProps) => {
  const fileType = fileUrl?.split(".").pop();

  const isAdmin = currentMember.role === MemberRole["ADMIN"];
  const isModerator = currentMember.role === MemberRole["MODERATOR"];
  const isOwner = currentMember.role === member.id;

  const canDelete = !deleted && (isAdmin || isModerator || isOwner);
  const canEdit = !deleted && isOwner && !fileUrl;

  const isPdf = fileType === "pdf" && fileUrl;
  const isImage = !isPdf && fileUrl;

  const [isEditting, setIsEditting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="relative group flex items-center p-4 transition w-full hover:bg-primary/40">
      <div className="group flex gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={member.profile.imgUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                className={cn(
                  bold.className,
                  "text-sm hover:text-secondary hover:underline text-zinc-300 cursor-pointer pr-1"
                )}
              >
                {member.profile.name}
              </p>
              <ActionTooltip label={`${member.role}`}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className={cn(code.className, "text-xs text-zinc-400")}>
              ({timestamp})
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rouneed-md mt-2 overflow-hidden border flex items-center bg-primary h-48 w-48"
            >
              <Image
                src={fileUrl}
                alt={content}
                className="object-cover"
                fill
              />
            </a>
          )}
          {!fileUrl && !isEditting && (
            <p
              className={cn(
                primary.className,
                "text-sm text-zinc-200",
                deleted && "text-xs text-red-400 italic mt-1"
              )}
            >
              {content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
