"use client";

import { Fragment, useRef, ElementRef } from "react";
import { format } from "date-fns";

import { Member, Message, Profile } from "@prisma/client";
import { useChatQuery } from "@/hooks/useChatQuery";

import { ImSpinner } from "react-icons/im";
import { LuServerCrash } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { primary } from "@/app/fonts";

import ChatWelcome from "@/components/chat/ChatWelcome";
import ChatItem from "@/components/chat/ChatItem";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useChatScroll } from "@/hooks/useChatScroll";

interface ChatMessagesProps {
  name: string;
  chatId: string;
  socketUrl: string;
  apiUrl: string;
  paramValue: string;
  member: Member;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  type: "channel" | "conversation";
}

const DATE_FORMAT = "MMM d,yy @ HH:mm";

type MessageWithMemberAndProfile = Message & {
  member: Member & { profile: Profile };
};

const ChatMessages = ({
  name,
  chatId,
  member,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } =
    useChatQuery({ queryKey, apiUrl, paramKey, paramValue });

  useChatSocket({ queryKey, addKey, updateKey });
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

  if (status === "loading") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ImSpinner className="h-7 w-7 text-zinc-400 animate-spin mb-1" />
        <span className={cn(primary.className, "text-sm text-zinc-400")}>
          Loading messages ...
        </span>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <LuServerCrash className="h-7 w-7 text-zinc-400 mb-1" />
        <span className={cn(primary.className, "text-sm text-zinc-400")}>
          Something went wrong 😓
        </span>
      </div>
    );
  }
  return (
    <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome type={type} name={name} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <ImSpinner className="h-7 w-7 text-zinc-400 animate-spin mb-1" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-zinc-500 text-xs my-4 hover:text-zinc-400 hover:underline transition"
            >
              Load Previous Messages
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((batch, index) => (
          <Fragment key={index}>
            {batch.items.map((message: MessageWithMemberAndProfile) => (
              <ChatItem
                currentMember={member}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
                key={message.id}
                id={message.id}
                member={message.member}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                isUpdated={message.updatedAt !== message.createdAt}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
