"use client";

import { useParams, useRouter } from "next/navigation";

import { bold, primary } from "@/app/fonts";
import { useEffect, useState } from "react";
import { BsSearch, BsCommand } from "react-icons/bs";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface ServerSearchProps {
  data: {
    label: string;
    type: "channel" | "member";
    data:
      | {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
}

export const ServerSearch = ({ data }: ServerSearchProps) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);

    return () => {
      document.removeEventListener("keydown", down);
    };
  }, []);

  const onClick = ({
    id,
    type,
  }: {
    id: string;
    type: "channel" | "member";
  }) => {
    setOpen(false);

    if (type === "member") {
      return router.push(`/servers/${params?.serverId}/conversations/${id}`);
    }

    if (type === "channel") {
      return router.push(`/servers/${params?.serverId}/channels/${id}`);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group px-2 py-2 gap-2 rounded-md flex items-center w-full hover:bg-tertiary bg-tertiary/60 transition"
      >
        <BsSearch className="w-4 h-4 text-white" />
        <p
          className={`text-white text-sm ${bold.className} group-hover:text-zinc-300 transition`}
        >
          Search
        </p>
        <kbd
          className={`${primary.className} pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded-md bg-primary/40 px-1.5 text-[10px] ml-auto`}
        >
          <span className="text-xs">
            <BsCommand />
          </span>
          K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search all channels and members" />
        <CommandList className={primary.className}>
          <CommandEmpty>No results found</CommandEmpty>
          {data.map(({ label, type, data }) => {
            if (!data?.length) return null;

            return (
              <CommandGroup key={label} heading={label}>
                {data?.map(({ id, icon, name }) => {
                  return (
                    <CommandItem
                      onSelect={() => onClick({ id, type })}
                      key={id}
                    >
                      {icon} <span>{name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};
