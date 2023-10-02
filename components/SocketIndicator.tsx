"use client";

import { primary } from "@/app/fonts";
import { useSocket } from "@/components/providers/socket-provider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ImSpinner } from "react-icons/im";
import { PiPlugsConnectedBold } from "react-icons/pi";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected)
    return (
      <Badge
        variant="outline"
        className={cn(
          "bg-yellow-500 text-white border-none",
          primary.className
        )}
      >
        Connecting <ImSpinner className="animate-spin ml-2" />
      </Badge>
    );

  return (
    <Badge
      variant="outline"
      className={cn("bg-emerald-500 text-white border-none", primary.className)}
    >
      Connected <PiPlugsConnectedBold className="animate-pulse ml-2" />
    </Badge>
  );
};
