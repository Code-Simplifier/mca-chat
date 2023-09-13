"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/UserAvatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

import { primary, bold } from "@/app/fonts";

import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { IoExit } from "react-icons/io5";
import { BiLoader } from "react-icons/bi";
import {
  BsShieldFillCheck,
  BsThreeDotsVertical,
  BsShieldFillExclamation,
  BsCheck2All,
} from "react-icons/bs";

import qs from "query-string";
import { useModal } from "@/hooks/useModalStore";
import { ServerWithMembersWithProfiles } from "@/types";
import { useState } from "react";
import { MemberRole } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";

const roleIconMap = {
  GUEST: null,
  MODERATOR: <FaChalkboardTeacher className="h-6 w-6 text-rose-400" />,
  ADMIN: <BsShieldFillCheck className="h-6 w-6 text-secondary" />,
};

export const MembersModal = () => {
  const router = useRouter();
  const { isOpen, onClose, onOpen, type, data } = useModal();
  const [loadingId, setLoadingId] = useState("");

  const isModalOpen = isOpen && type === "members";
  const { server } = data as { server: ServerWithMembersWithProfiles };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });
      const response = await axios.delete(url);
      router.refresh();
      onOpen("members", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });

      const response = await axios.patch(url, { role });
      router.refresh();
      onOpen("members", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent
        className={`bg-primary text-white rounded-lg overflow-hidden ${primary.className}`}
      >
        <DialogHeader className="pt-6 px-6">
          <DialogTitle
            className={`text-3xl text-secondary text-center ${bold.className}`}
          >
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-lg text-zinc-500 uppercase">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px]">
          {server?.members?.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-x-2 mb-2 bg-secondary/20 rounded-lg p-2"
            >
              <UserAvatar src={member.profile.imgUrl} />
              <div className="flex flex-col gap-y-1">
                <div
                  className={`${bold.className} text-sm flex items-center gap-x-2`}
                >
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p>{member.profile.email}</p>
              </div>
              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <BsThreeDotsVertical className="h-5 w-5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        side="left"
                        className="bg-primary text-zinc-400"
                      >
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center bg-primary">
                            <BsShieldFillExclamation className="h-4 w-4 mr-2" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent className="bg-primary text-white">
                              <DropdownMenuItem
                                onClick={() => onRoleChange(member.id, "GUEST")}
                              >
                                <FaUserGraduate className="h-4 w-4 mr-2" />
                                Guest
                                {member.role === "GUEST" && (
                                  <BsCheck2All className="h-4 w-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member.id, "MODERATOR")
                                }
                              >
                                <FaChalkboardTeacher className="h-4 w-4 mr-2" />
                                Moderator
                                {member.role === "MODERATOR" && (
                                  <BsCheck2All className="h-4 w-4 ml-2" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onKick(member.id)}
                          className="text-rose-400"
                        >
                          <IoExit className="h-4 w-4 mr-2" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <BiLoader className="animate-spin text-zinc-500 ml-auto" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
