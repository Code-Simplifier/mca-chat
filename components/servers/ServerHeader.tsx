"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";

import { bold, primary } from "@/app/fonts";

import { IoIosArrowDropdownCircle } from "react-icons/io";
import {
  BsPersonFillAdd,
  BsFillTrash3Fill,
  BsPeopleFill,
} from "react-icons/bs";

import { IoSettings, IoExit } from "react-icons/io5";
import { BiGitBranch } from "react-icons/bi";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/useModalStore";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const { onOpen } = useModal();

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button
          className={`${bold.className} uppercase tracking-tight w-full h-12 text-md px-3 flex items-center bg-secondary/80 hover:bg-primary/95 hover:text-secondary transition`}
        >
          {server.name}
          <IoIosArrowDropdownCircle className="h-6 w-6 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`${primary.className} w-56 text-sm text-zinc-500 space-y-[2px]`}
      >
        {isModerator && (
          <DropdownMenuItem
            onClick={() => {
              onOpen("invite", { server });
            }}
            className="text-emerald-700 px-3 py-2 cursor-pointer"
          >
            Invite Members
            <BsPersonFillAdd className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("editServer", { server })}
            className="px-3 py-2 cursor-pointer"
          >
            Server Settings
            <IoSettings className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("members", { server })}
            className="px-3 py-2 cursor-pointer"
          >
            Manage Members
            <BsPeopleFill className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("createChannel")}
            className="px-3 py-2 cursor-pointer"
          >
            Create a channel
            <BiGitBranch className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("deleteServer", { server })}
            className="text-tertiary px-3 py-2 cursor-pointer"
          >
            Delete Server
            <BsFillTrash3Fill className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("leaveServer", { server })}
            className="text-tertiary px-3 py-2 cursor-pointer"
          >
            Leave Server
            <IoExit className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
