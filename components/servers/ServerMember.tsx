"use client";

import { cn } from "@/lib/utils";
import { Member, Profile, Server } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { BsShieldFillCheck } from "react-icons/bs";
import { FaChalkboardTeacher } from "react-icons/fa";
import { UserAvatar } from "@/components/UserAvatar";

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <FaChalkboardTeacher className="h-4 w-4 text-rose-400" />,
  ADMIN: <BsShieldFillCheck className="h-4 w-4 text-secondary" />,
};

export const ServerMember = ({ member, server }: ServerMemberProps) => {
  const params = useParams();
  const router = useRouter();
  const icon = roleIconMap[member.role];
  return (
    <button
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/50 transition",
        params?.memberId === member.id && "bg-zinc-700"
      )}
    >
      <UserAvatar
        src={member.profile.imgUrl}
        className="h-6 w-6 md:h-6 md:w-6"
      />
      <p
        className={cn(
          "text-sm text-zinc-400 group-hover:text-zinc-500 transition",
          params?.channelId === member.id &&
            "text-secondary group-hover:text-white"
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
};
