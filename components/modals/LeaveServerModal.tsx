"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { primary, bold } from "@/app/fonts";

import { useModal } from "@/hooks/useModalStore";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const LeaveServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "leaveServer";
  const { server } = data;

  const [isLoading, setIsLoading] = useState(false);

  const onLeave = async () => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/servers/${server?.id}/leave`);
      onClose();
      router.refresh();
      router.push("/");
    } catch (error) {}
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent
        className={`bg-primary rounded-lg overflow-hidden ${primary.className}`}
      >
        <DialogHeader className="pt-6 px-6">
          <DialogTitle
            className={`text-3xl text-secondary text-center ${bold.className}`}
          >
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-400">
            If you leave{" "}
            <span className={`uppercase text-secondary ${bold.className} `}>
              {server?.name}
            </span>
            , you <span className="uppercase">cannot</span> rejoin it unless
            invited.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button variant="error" disabled={isLoading} onClick={onLeave}>
              leave
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
