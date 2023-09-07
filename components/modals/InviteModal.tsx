"use client";

import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { FiCopy, FiRefreshCcw } from "react-icons/fi";
import { BsCheck2All } from "react-icons/bs";

import { primary, bold, code } from "@/app/fonts";

import { useModal } from "@/hooks/useModalStore";
import { useOrigin } from "@/hooks/useOrigin";
import { useState } from "react";

export const InviteModal = () => {
  const origin = useOrigin();
  const { isOpen, onClose, onOpen, type, data } = useModal();

  const isModalOpen = isOpen && type === "invite";
  const { server } = data;
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );
      onOpen("invite", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent
        className={`bg-white text-black rounded-lg overflow-hidden ${primary.className}`}
      >
        <DialogHeader className="pt-6 px-6">
          <DialogTitle
            className={`text-2xl text-primary text-center ${bold.className}`}
          >
            Invite Members
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label
            className={`${bold.className} uppercase tracking-tight text-zinc-400`}
          >
            Server Invite link
          </Label>
          <div className="flex mt-2 items-center gap-x-2">
            <Input
              disabled={isLoading}
              className={`bg-zinc-300/50 text-zinc-500 ${code.className} border-0 focus-visible:ring-0 focus-visible:ring-offset-0`}
              value={inviteUrl}
            />
            <Button
              disabled={isLoading}
              onClick={onCopy}
              variant="ghost"
              size="icon"
            >
              {isCopied ? <BsCheck2All size={20} /> : <FiCopy size={20} />}
            </Button>
          </div>
          <Button
            onClick={onNew}
            disabled={isLoading}
            variant="link"
            className="mt-4"
          >
            Generate a new link
            <FiRefreshCcw className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
