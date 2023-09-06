"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/ActionTooltip";

interface NavItemProps {
  id: string;
  name: string;
  imgUrl: string;
}

const NavItem = ({ id, name, imgUrl }: NavItemProps) => {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/servers/${id}`);
  };

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button onClick={onClick} className="group relative flex items-center">
        <div
          className={cn(
            "absolute left-0 bg-secondary rounded-r-full transition-all w-[4px]",
            params?.serverId !== id && "group-hover:h-[20px]",
            params?.serverId === id ? "h-[36px]" : "h-[8px]"
          )}
        />

        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            params?.serverId === id &&
              "bg-secondary/10 text-secondary rounded-[16px] border-2 border-secondary"
          )}
        >
          <Image fill src={imgUrl} alt="channel" />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default NavItem;
