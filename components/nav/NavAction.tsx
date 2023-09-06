"use client";

import { AiOutlinePlus } from "react-icons/ai";
import { ActionTooltip } from "@/components/ActionTooltip";
import { useModal } from "@/hooks/useModalStore";

export const NavAction = () => {
  const { onOpen } = useModal();
  return (
    <div>
      <ActionTooltip side="right" align="center" label="new server">
        <button
          onClick={() => {
            onOpen("createServer");
          }}
          className="group"
        >
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-secondary group-hover:bg-tertiary">
            <AiOutlinePlus
              className="group-hover:text-white transition text-primary"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
