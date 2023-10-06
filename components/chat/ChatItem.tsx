"use client";

import { Member, MemberRole, Profile } from "@prisma/client";

import { UserAvatar } from "@/components/UserAvatar";
import { ActionTooltip } from "@/components/ActionTooltip";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";

import { cn } from "@/lib/utils";
import { bold, code, primary } from "@/app/fonts";

import { FaChalkboardTeacher } from "react-icons/fa";
import { BsShieldFillCheck, BsFillTrashFill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { FileIcon } from "lucide-react";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useModal } from "@/hooks/useModalStore";
import { useRouter, useParams } from "next/navigation";

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

const formSchema = z.object({
  content: z.string().min(1),
});

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
  const router = useRouter();
  const params = useParams();

  const isAdmin = currentMember.role === MemberRole["ADMIN"];
  const isModerator = currentMember.role === MemberRole["MODERATOR"];
  const isOwner = currentMember.id === member.id;

  const canDelete = !deleted && (isAdmin || isModerator || isOwner);
  const canEdit = !deleted && isOwner && !fileUrl;

  const isPdf = fileType === "pdf" && fileUrl;
  const isImage = !isPdf && fileUrl;

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { onOpen } = useModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: content },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    form.reset({ content: content });
  }, [content]);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keyDown", handleKeyDown);
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);

      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onMemberClick = () => {
    if (member.id === currentMember.id) {
      return;
    }

    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  return (
    <div className="relative group flex items-center p-4 transition w-full hover:bg-primary/40">
      <div className="group flex gap-x-2 items-start w-full">
        <div
          onClick={onMemberClick}
          className="cursor-pointer hover:drop-shadow-md transition"
        >
          <UserAvatar src={member.profile.imgUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                onClick={onMemberClick}
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
          {isPdf && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF File
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                primary.className,
                "text-sm text-zinc-200",
                deleted && "text-xs text-red-400 italic mt-1"
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-400">(edited)</span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center w-full gap-x-2 pt-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="p-2 bg-primary border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-200"
                            placeholder="edited msg"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button variant="secondary" size="sm">
                  Save
                </Button>
              </form>
              <span
                className={cn(
                  code.className,
                  " text-zinc-500 text-sm tracking-tighter"
                )}
              >
                Press{" "}
                <kbd className="text-secondary pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded-md bg-primary/40 px-1.5 text-[10px] ml-auto">
                  ESC
                </kbd>{" "}
                to cancel
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDelete && (
        <div className="hidden group-hover:flex absolute items-center gap-x-2 p-1 bg-primary -top-2 right-5 rounded-sm">
          <BsFillTrashFill
            onClick={() => {
              onOpen("deleteMessage", {
                apiUrl: `${socketUrl}/${id}`,
                query: socketQuery,
              });
            }}
            className="cursor-pointer ml-auto w-4 h-4 hover:text-secondary transition"
          />
          {canEdit && (
            <AiFillEdit
              onClick={() => setIsEditing(true)}
              className="cursor-pointer ml-auto w-4 h-4 hover:text-secondary transition"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ChatItem;
